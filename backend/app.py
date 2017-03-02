from flask import Flask, request, jsonify
from cerberus import Validator
from flask_cors import cross_origin, CORS

from problem import SeatingProblem, Location

app = Flask(__name__)
CORS(app)

@app.route("/solve", methods=['POST', 'OPTIONS'])
def solve():
    if request.method == 'OPTIONS':
        return ''

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
                'allowedDistances': {
                    'required': True,
                    'type': 'list',
                    'minlength': 1,
                    'schema': {
                        'type': 'string',
                        'allowed': ['next', 'front', 'diagonal']
                    }
                },
                'employee1Name': {'required': True, 'type': 'string', 'empty': False},
                'employee2Name': {'required': True, 'type': 'string', 'empty': False},
            }
        },
        'positionConstraints': {
            'required': True,
            'type': 'list',
            'schema': {
                'tableLocation': {
                    'required': True,
                    'type': 'dict',
                    'schema': {
                        'rowIndex': {'required': True, 'type': 'integer', 'min': 0},
                        'colIndex': {'required': True, 'type': 'integer', 'min': 0},
                    }
                },
                'employeeName': {'required': True, 'type': 'string', 'empty': False},
            }
        },
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
        allowed_distances = constraint['allowedDistances']
        problem.add_distance_constraint(employee1_name=employee1_name, employee2_name=employee2_name, allowed_distances=allowed_distances)

    for constraint in json['positionConstraints']:
        employee_name = constraint['employeeName']
        table_location = constraint['tableLocation']
        location = Location(row=table_location['rowIndex'], col=table_location['colIndex'])
        problem.add_position_constraint(employee_name=employee_name, table_location=location)

    result = problem.solve()

    if not result:
        return jsonify({ 'success': False })

    return jsonify({
        'success': True,
        'assignments': result
    })

if __name__ == "__main__":
    app.run(debug=True)
