# A simple web page
from flask import Flask, request, render_template_string
import os

# get flag from env
FLAG = os.environ.get('FLAG', 'flag{this_is_a_fake_flag}')

app = Flask(__name__)

@app.route('/')
def index():
    return render_template_string('''
        <h1>Server Side Template Injection</h1>
        <p>Enter your name:</p>
        <form method="post">
            <input type="text" name="name">
            <input type="submit">
        </form>
        <p>Hello, {{ name }}</p>
    ''')

@app.route('/', methods=['POST'])
def index_post():
    name = request.form['name']
    return render_template_string('''
        <h1>Server Side Template Injection</h1>
        <p>Enter your name:</p>
        <form method="post">
            <input type="text" name="name">
            <input type="submit">
        </form>
        <p>Hello, ''' + name + '''</p>
    ''', name=name, **globals())

# ok now serve
if __name__ == '__main__':
    app.run(port=8082)