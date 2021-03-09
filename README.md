# Certificate Generator Server

We will use `Flask` to build our server and `opencv-python` for certificate processing

_Note: All needed packages are encapsulated inside `requirements.txt` file_

## Setup Guide for both Backend and Frontend

Install `virtualenv`

```sh
pip install virtualenv
```

For Windows:

```sh
git clone https://github.com/shecodesvietnam/certificate-generator.git
cd certificate-generator
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

For Linux:

```sh
git clone https://github.com/shecodesvietnam/certificate-generator.git
cd certificate-generator
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

## Setup Guide for Frontend after install Python venv

```sh
cd static/homepage
npm i
npm run build
```

### To re-render the view

```sh
npm run build
```
