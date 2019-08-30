Table Seating Solver
====================

Using linear constraints and a LP/MIP solver.

<https://table-seating-solver.herokuapp.com/>

Run
---

### Backend

```
cd backend
virtualenv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

### Frontend

```
cd frontend
nvm use
npm install
npm start
```

Deploy
-------

```
heroku login
git remote add heroku-api https://git.heroku.com/table-seating-solver-api.git
git remote add heroku https://git.heroku.com/table-seating-solver.git
```

### Backend

```
git subtree push --prefix backend heroku-api master
```

### Frontend

```
git subtree push --prefix frontend heroku master
```