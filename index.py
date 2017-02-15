import copy

from tabulate import tabulate
from pulp import *

class SeatingProblem:

    def __init__(self):
        self.problem = LpProblem("seating", LpMinimize)
        self.assignment_variables = None

        self.layout = []
        self.num_rows = 0
        self.num_cols = 0

        self.employees = []
        self.num_employees = 0

    def set_employees(self, employees):
        self.employees = employees
        self.num_employees = len(employees)

    def set_table_layout(self, layout):
        self.layout = layout
        self.num_rows = len(layout)
        self.num_cols = len(layout[0]) if self.num_rows > 0 else 0

    def add_assignment_variables(self):

        assignment_variables = [[None for col in range(self.num_cols)] for row in range(self.num_rows)]
        for row in range(self.num_rows):
            for col in range(self.num_cols):

                if not self.layout[row][col]:
                    continue

                table_vars = []
                for employee_index in range(self.num_employees):
                    var_name = 'assignment_row-{}_col-{}_employee-{}'.format(row, col, employee_index)
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

    def get_employee_index_assigned_to_table(self, row, col):
        vars = self.assignment_variables[row][col]
        for employee_index, var in enumerate(vars):
            if var.varValue == 1:
                return employee_index
        return None

    def solve(self):
        self.add_assignment_variables()
        self.add_table_has_max_one_employee_constraint()
        self.add_employee_seated_once_constraint()

        status = self.problem.solve()

        if status != LpStatusOptimal:
            return None

        assignments = copy.deepcopy(self.layout)
        for row in range(self.num_rows):
            for col in range(self.num_cols):

                if not self.layout[row][col]:
                    assignments[row][col] = '-'
                    continue

                employee_index = self.get_employee_index_assigned_to_table(row, col)
                if employee_index == None:
                    assignments[row][col] = '-'
                    continue

                employee_name = self.employees[employee_index]
                assignments[row][col] = employee_name

        return assignments

problem = SeatingProblem()
problem.set_employees(['Lois', 'Randy', 'Alex'])
problem.set_table_layout([
    [True, True, False, True]
])
result = problem.solve()

print(tabulate(result))
