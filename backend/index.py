from flask import Flask, request, jsonify
from cerberus import Validator

from problem import SeatingProblem

app = Flask(__name__)

@app.route("/solve", methods=['POST'])
def solve():
    json = request.get_json()

    schema = {
        'layout': {
            'required': True,
            'type': 'list',
            'schema': {
                'type': 'list',
                'schema': {
                    'type': 'boolean'
                }
            }
        },
        'employeeNames': {
            'required': True,
            'type': 'list',
            'schema': {
                'type': 'string',
                'empty': False
            }
        },
        'employeeTags': {
            'required': True,
            'type': 'dict',
            'valueschema': {
                'type': 'string',
                'empty': False
            }
        },
        'tableTags': {
            'required': True,
            'type': 'list',
            'schema': {
                'type': 'list',
                'schema': {
                    'type': 'list',
                    'schema': {
                        'type': 'string',
                        'empty': False
                    }
                }
            }
        },
        'distanceConstraints': {
            'required': True,
            'type': 'list',
            'schema': {
                'distance': {'required': True, 'type': 'integer', 'min': 1},
                'employee1Name': {'required': True, 'type': 'string', 'empty': False},
                'employee2Name': {'required': True, 'type': 'string', 'empty': False},
            }
        }
    }

    validator = Validator(schema)
    validator.allow_unknown = True

    if not validator.validate(json):
        response = jsonify({
            'error': 'Could not validate payload',
            'details': validator.errors
        })
        return response, 400

    problem = SeatingProblem()
    problem.set_employees(json['employeeNames'])
    problem.set_table_layout(json['layout'])
    problem.set_table_tags(json['tableTags'])
    problem.set_employee_tags(json['employeeTags'])

    for constraint in json['distanceConstraints']:
        employee1_name = constraint['employee1Name']
        employee2_name = constraint['employee2Name']
        distance = constraint['distance']
        problem.add_distance_constraint(employee1_name=employee1_name, employee2_name=employee2_name, distance=distance)

    #problem.add_position_constraint(employee_name='Randy', table_location=Location(row=0, col=0))

    result = problem.solve()

    if not result:
        return jsonify({ 'success': False })

    return jsonify({
        'success': True,
        'assignments': result
    })

if __name__ == "__main__":
    app.run(debug=True)
