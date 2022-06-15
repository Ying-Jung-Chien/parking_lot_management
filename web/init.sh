#!/bin/bash

virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
pip install -U click==8 # do this to avoid AttributeError: module 'click' has no attribute 'get_os_args'


# streamlit run app.py
