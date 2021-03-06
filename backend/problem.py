import copy
from pulp import *

class Location:
    def __init__(self, row, col):
        self.row = row
        self.col = col

class SeatingProblem:

    def __init__(self):
        self.problem = LpProblem("seating", LpMinimize)
        self.assignment_variables = None

        self.layout = []
        self.num_rows = 0
        self.num_cols = 0

        self.table_tags = []
        self.employee_tags = []

        self.employees = []
        self.num_employees = 0

    def set_employees(self, employees):
        self.employees = employees
        self.num_employees = len(employees)

    def set_table_layout(self, layout):
        self.layout = layout
        self.num_rows = len(layout)
        self.num_cols = len(layout[0]) if self.num_rows > 0 else 0

    def set_table_tags(self, table_tags):
        self.table_tags = table_tags

    def set_employee_tags(self, employee_tags):
        self.employee_tags = employee_tags

        self.add_assignment_variables_if_necessary()

        for employee_name, tag in employee_tags.items():
            employee_index = self.employees.index(employee_name)
            if employee_index == -1:
                raise ValueError("Could not find index of provided employee {}".format(employee_name))

            for row in range(self.num_rows):
                for col in range(self.num_cols):

                    if not self.layout[row][col]:
                        continue

                    table_tags = self.table_tags[row][col]
                    if not tag in table_tags:
                        assignment_var = self.assignment_variables[row][col][employee_index]
                        self.problem += (assignment_var == 0)

    def add_assignment_variables_if_necessary(self):

        if self.assignment_variables:
            return

        assignment_variables = [[None for col in range(self.num_cols)] for row in range(self.num_rows)]
        for row in range(self.num_rows):
            for col in range(self.num_cols):

                if not self.layout[row][col]:
                    continue

                table_vars = []
                for employee_index in range(self.num_employees):
                    var_name = 'assignment_row_{}_col_{}_employee_{}'.format(row, col, employee_index)
                    var = LpVariable(name=var_name, lowBound=0, upBound=1, cat='Integer')
                    self.problem += var
                    table_vars.append(var)
                assignment_variables[row][col] = table_vars

        self.assignment_variables = assignment_variables

    # A table can only have one employee (or 0)
    def add_table_has_max_one_employee_constraint(self):
        for row in range(self.num_rows):
            for col in range(self.num_cols):

                if not self.layout[row][col]:
                    continue

                sum = None
                for employee_index in range(self.num_employees):
                    assignment_var = self.assignment_variables[row][col][employee_index]
                    sum += assignment_var
                self.problem += (sum <= 1)

    # An employee can only be seated once
    def add_employee_seated_once_constraint(self):
        for employee_index in range(self.num_employees):
            sum = None
            for row in range(self.num_rows):
                for col in range(self.num_cols):

                    if not self.layout[row][col]:
                        continue

                    assignment_var = self.assignment_variables[row][col][employee_index]
                    sum += assignment_var
            self.problem += (sum == 1)

    def add_distance_constraint(self, employee1_name, employee2_name, allowed_distances):

        self.add_assignment_variables_if_necessary()

        employee1_index = self.employees.index(employee1_name)
        employee2_index = self.employees.index(employee2_name)

        distance_map = {
            'next': 1,
            'front': 2,
            'diagonal': 4,
        }

        distance = max(map(lambda d: distance_map[d], allowed_distances))

        if employee1_index == -1 or employee2_index == -1:
            raise ValueError("Could not find index of one of the provided employees")

        sum = None
        for row1 in range(self.num_rows):
            for col1 in range(self.num_cols):
                for row2 in range(self.num_rows):
                    for col2 in range(self.num_cols):

                        table1_assignment_vars = self.assignment_variables[row1][col1]
                        table2_assignment_vars = self.assignment_variables[row2][col2]

                        if not table1_assignment_vars or not table2_assignment_vars:
                            continue

                        table1_location = Location(row=row1, col=col1)
                        table2_location = Location(row=row2, col=col2)
                        is_employee1_at_table1 = table1_assignment_vars[employee1_index]
                        is_employee2_at_table2 = table2_assignment_vars[employee2_index]
                        are_both_true = self.add_and_return_logical_and_var(is_employee1_at_table1, is_employee2_at_table2)
                        distance_table1_table2 = self.get_distance_between_tables(table1_location, table2_location)

                        sum += (are_both_true * distance_table1_table2)

        self.problem += (sum <= distance)

    def add_position_constraint(self, employee_name, table_location):
        employee_index = self.employees.index(employee_name)

        if employee_index == -1:
            raise ValueError("Could not find index of provided employee")

        if table_location.row >= self.num_rows or table_location.col >= self.num_cols:
            raise ValueError("Table location doesn't match the provided layout")

        var = self.assignment_variables[table_location.row][table_location.col][employee_index]
        self.problem += (var == 1)


    def get_employee_index_assigned_to_table(self, row, col):
        vars = self.assignment_variables[row][col]
        for employee_index, var in enumerate(vars):
            if var.varValue == 1:
                return employee_index
        return None

    def get_distance_between_tables(self, table1_location, table2_location):

        are_next_to = table1_location.row == table2_location.row and abs(table1_location.col - table2_location.col) == 1
        are_in_front = table1_location.col == table2_location.col and abs(table1_location.row - table2_location.row) == 1
        are_diagonal = abs(table1_location.col - table2_location.col) == 1

        if are_next_to:
            return 1

        if are_in_front:
            return 2

        if are_diagonal:
            return 4

        return 8

    def add_and_return_logical_and_var(self, var1, var2):
        var_name = 'and_{}_{}'.format(var1.name, var2.name)
        and_var = LpVariable(name=var_name, lowBound=0, upBound=1, cat='Integer')
        self.problem += (and_var >= var1 + var2 - 1)
        self.problem += (and_var <= var1)
        self.problem += (and_var <= var2)
        return and_var

    def solve(self):
        self.add_assignment_variables_if_necessary()
        self.add_table_has_max_one_employee_constraint()
        self.add_employee_seated_once_constraint()

        status = self.problem.solve()

        if status != LpStatusOptimal:
            return None

        assignments = copy.deepcopy(self.layout)
        for row in range(self.num_rows):
            for col in range(self.num_cols):

                if not self.layout[row][col]:
                    assignments[row][col] = None
                    continue

                employee_index = self.get_employee_index_assigned_to_table(row, col)
                if employee_index == None:
                    assignments[row][col] = None
                    continue

                employee_name = self.employees[employee_index]
                assignments[row][col] = employee_name

        return assignments
