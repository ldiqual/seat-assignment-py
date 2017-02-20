from tabulate import tabulate

employees = [
    'Robert', 'Scott', 'Guy', 'Bo', 'Idan', 'Chloe', 'Lois', 'Kaili', 'Alex', 'Randy', # Eng
    'Cassy', 'Sam', 'Enrico', 'Rachel', 'Jon', 'Yarin', # Product
    'Clavens', 'Laura Lynn', 'Baker', 'Julie', # Marketing
    'Rob', 'Tim', 'Rebecca', 'Adam', 'David W', 'Kitty', 'Sabrina', # Sales
    'Enrique', 'Justin', 'Bobby', 'Ericka' # Support
]

layout = [
    [True,  True,  True,  True,  True,  True,  True],
    [True,  True,  True,  True,  True,  True,  False],
    [False, False, False, False, False, False, False],

    [True,  True,  True,  True,  True,  True,  False],
    [True,  True,  True,  True,  True,  True,  False],
    [False, False, False, False, False, False, False],

    [True,  True,  True,  True,  True,  True,  False],
    [True,  True,  True,  True,  True,  True,  False],
    [False, False, False, False, False, False, False],

    [False, False, False, True,  True,  False,  False],
    [False, False, False, True,  True,  False,  False],
]

table_tags = [[[] for col in range(7)] for row in range(11)]
def set_tags(row, tags):
    for col in range(len(table_tags[row])):
        table_tags[row][col] = tags
set_tags(0, ['eng'])
set_tags(1, ['eng'])
set_tags(3, ['product'])
set_tags(4, ['product', 'marketing'])
set_tags(6, ['marketing', 'sales'])
set_tags(7, ['sales', 'support'])
set_tags(9, ['support'])

employee_tags = {

    'Robert': 'eng',
    'Scott': 'eng',
    'Guy': 'eng',
    'Bo': 'eng',
    'Idan': 'eng',
    'Chloe': 'eng',
    'Lois': 'eng',
    'Kaili': 'eng',
    'Alex': 'eng',
    'Randy': 'eng',

    'Cassy': 'product',
    'Sam': 'product',
    'Enrico': 'product',
    'Rachel': 'product',
    'Jon': 'product',
    'Yarin': 'product',

    'Clavens': 'marketing',
    'Laura Lynn': 'marketing',
    'Baker': 'marketing',
    'Julie': 'marketing',

    'Rob': 'sales',
    'Tim': 'sales',
    'Rebecca': 'sales',
    'Adam': 'sales',
    'David W': 'sales',
    'Kitty': 'sales',
    'Sabrina': 'sales',

    'Enrique': 'support',
    'Justin': 'support',
    'Bobby': 'support',
    'Ericka': 'support'
}


problem = SeatingProblem()
problem.set_employees(employees)
problem.set_table_layout(layout)
problem.set_table_tags(table_tags)
problem.set_employee_tags(employee_tags)
problem.add_distance_constraint(employee1_name='Lois', employee2_name='Randy', distance=1)
problem.add_position_constraint(employee_name='Randy', table_location=Location(row=0, col=0))
result = problem.solve()

print(tabulate(result))
