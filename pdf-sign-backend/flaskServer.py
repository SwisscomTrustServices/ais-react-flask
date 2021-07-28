from flask import Flask, url_for, request, jsonify, make_response
from flask.helpers import send_file
import shlex
import subprocess
import os
from flask_cors import CORS
import glob

app = Flask(__name__)
# specify absolute path
app.config['UPLOAD_FOLDER'] = '/Users/mata/Downloads/github/swisscom/ais-react-frontend/pdf-sign-backend/pdf/'
cors = CORS(app, resources={r"/upload": {"origins": "http://localhost:3000"},
                            r"/signpdf": {"origins": "http://localhost:3000"}})

@app.route('/')
def index():

    return 'helloWorld'


@app.route('/upload', methods=['POST'])
def upload_file():

    try:
        print(request.files)
        pdf_file = request.files['pdf-file']
        if pdf_file:
            filename = pdf_file.filename
            pdf_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return make_response(jsonify({'code': 'SUCCESS'}), 200)

    except Exception as e:
        return jsonify({"error": str(e), }), 500
    


@app.route('/signpdf', methods=["POST"])
def signpdf():

    try:

        request_data = request.get_json()
        pdfTitle = request_data['pdfTitle']

        shellCommand = './target/release/itext7-ais-1.2.0/bin/ais-client.sh -config target/release/itext7-ais-1.2.0/bin/sign-pdf.properties -type ondemand-stepup -input pdf/'+pdfTitle+'.pdf -vvv'
        print("shell command: ",shellCommand)
        subprocess.call(shlex.split(shellCommand))

        return make_response(jsonify({'code': 'SUCCESS'}), 200)
    
    except Exception as e:
        return jsonify({"error": str(e), }), 500


@app.route('/uploads/<path:filename>', methods=['GET'])
def download(filename):

    list_of_files = glob.glob(app.config['UPLOAD_FOLDER']+filename+'*')
    latest_file = max(list_of_files, key=os.path.getctime)
    print("latest_file: ",latest_file)

    return send_file(latest_file)


with app.test_request_context():
    print(url_for('index'))
    print(url_for('signpdf'))

