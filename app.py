# TODO: Build your server here
# Author: Nguyen Thuy Trang

import os
import csv
import sys

from flask import Flask, request, send_file, render_template
from werkzeug.utils import secure_filename
from flask.json import jsonify
from flask_cors import CORS

from certificate import generate
import uuid


if not os.path.exists('assets'):
    os.makedirs('assets')

if not os.path.exists('assets/csv_uploads'):
    os.makedirs('assets/csv_uploads')

if not os.path.exists('assets/templates'):
    os.makedirs('assets/templates')

if not os.path.exists('assets/certs'):
    os.makedirs('assets/certs')

CUR_DIRECTORY = os.path.dirname(os.path.realpath('__file__'))

CSV_DIRECTORY = os.path.join(CUR_DIRECTORY, "assets/csv_uploads")
TEMPLATE_DIR = os.path.join(CUR_DIRECTORY, "assets/templates")

app = Flask(__name__)
CORS(app)


def check_file_type(filename, file_extension):
    """
    Returns status code 200 if all file types are supported.
    Otherwise, returns status code 415 with message respectively.   
    """

    is_allowed = '.' in filename and filename.rsplit(
        '.', 1)[1].lower() == file_extension

    if not (is_allowed):
        return (f"Allowed file type: {file_extension} only!", 415)

    return ('File successfully uploaded!', 200)


def get_name_list(csv_path, csv_filename):
    """
    Reads csv and converts it into list. 
    """
    name_list = []

    with open(csv_path, mode='r', encoding="UTF-8") as file:
        reader = csv.reader(file)
        try:
            for row in reader:
                name_list.append(row[0])
        except csv.Error as e:
            sys.exit(
                'file {}, line {}: {}'.format(
                    csv_filename, reader.line_num, e))

    return name_list


@app.route('/')
def index():
    return render_template('homepage/index.html')


# TODO: Write the logic of send-email
@app.route('/send-email', methods=['POST'])
def send_email():
    print(request.form['email-receivers'])
    return jsonify({'msg': 'Successfully sent emails'})


@app.route('/generate', methods=['POST'])
def get_input():
    """
    Returns status code 400 if no files uploaded.
    Returns status code 415 if file types are not supported.
    Invokes generating function if files successfully uploaded. 
    """
    student_name = None
    csv_file = None

    if 'text' in request.form:
        student_name = request.form['text']
    else:
        csv_file = request.files['csv']

    cert_template = request.files['template']
    coordinates = (float(request.form['x-coordinate']),
                   float(request.form['y-coordinate']) - 25)

    if not cert_template.filename:
        res = jsonify(
            {'message': 'Please upload a template to start generating.'})
        res.status_code = 400
        return res

    msg, status = check_file_type(cert_template.filename, 'png')
    if status != 200:
        return (jsonify(msg), status)

    # saves certificate template to `assets/templates` folder
    template_name = str(uuid.uuid4().hex) + \
        secure_filename(cert_template.filename)
    template_path = os.path.join(TEMPLATE_DIR, template_name)
    cert_template.save(template_path)

    # store in assets/certs
    # single name input -> PDF

    print(f'{template_path} {student_name} {coordinates}')

    if student_name:
        msg, status = generate(template_path, [student_name], coordinates)
        return send_file(msg["output_path"], as_attachment=True)

    msg, status = check_file_type(csv_file.filename, 'csv')
    if status != 200:
        return (jsonify(msg), status)

    # saves csv file to `uploads` folder
    csv_filename = str(uuid.uuid4().hex) + secure_filename(csv_file.filename)
    csv_path = os.path.join(CSV_DIRECTORY, csv_filename)
    csv_file.save(csv_path)

    # multiple name input -> ZIP (PDFs)
    name_list = get_name_list(csv_path, csv_filename)

    msg, status = generate(template_path, name_list, coordinates)

    print(msg["output_path"])
    return send_file(msg["output_path"], as_attachment=True)


if __name__ == "__main__":
    app.run(host='0.0.0.0')
