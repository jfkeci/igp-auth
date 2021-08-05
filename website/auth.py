
from flask import Blueprint, request, flash
from flask.templating import render_template

auth = Blueprint('auth', __name__)


@auth.route('/login', methods=['GET', 'POST'])
def login():
    return render_template("login.html", text="Testing")


@auth.route('/logout')
def logout():
    return "<p>logout</p>"


@auth.route('/sign-up', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        email = request.form.get('email')
        firstName = request.form.get('firstName')
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')

        if len(email) < 4:
            flash('Email must be greater than 3 chars', category = 'error')
        elif len(firstName) < 2:
            flash('First name must be greater than 1 chars', category = 'error')
        elif password1 != password2:
            flash('Passwords dont match', category = 'error')
        elif len(password1) <7:
            flash('Password must be at least 6 chars', category = 'error')
        else:
            flash('Account created!', category = 'success')

    return render_template("sign_up.html")

