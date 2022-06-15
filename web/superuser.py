import os
import json
import requests
import SessionState
import streamlit as st
import tensorflow as tf
import numpy as np
import pandas as pd
from utils import load_and_prep_image, classes_and_models, update_logger, predict_json
import time
import streamlit.components.v1 as components
from st_aggrid import AgGrid
from st_aggrid.grid_options_builder import GridOptionsBuilder


# cloud vision (for text recognition)
from google.cloud import vision

# firebase
import firebase_admin
from firebase_admin import db

# Setup environment credentials (you'll need to change these)
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "cloud-computing-350807-2e62be436ed7.json" # change for your GCP key
PROJECT = "cloud-computing-350807" # change for your GCP project
REGION = "us-central1" # change for your GCP region (where your model is hosted)

# Setup firebase
if not firebase_admin._apps:
    cred_obj = firebase_admin.credentials.Certificate('parking-lot-management-5116b-firebase-adminsdk-kwvyb-8e57e92837.json')
    default_app = firebase_admin.initialize_app(cred_obj, {
        'databaseURL': 'https://parking-lot-management-5116b-default-rtdb.firebaseio.com/'
    })

### Streamlit code (works as a straigtht-forward script) ###
st.set_page_config(layout='wide')
st.title("Welcome to Parking Lot Management for Supervisors")

st.subheader("All Accounts")
acc_folder =db.reference('account/')
acc_data = acc_folder.get()
accounts = []
for id, details in zip (acc_data.keys(), acc_data.values()):
    one_data = {}
    one_data['Student_ID'] = id
    for data_key, data_value in zip(details.keys(), details.values()):
        if data_key == "avatar" or data_key == "original": continue
        one_data[data_key] = data_value
    accounts.append(one_data)
df = pd.DataFrame(accounts)

AgGrid(df, height=300, theme="dark")
        


#############################################################
m = st.markdown(""" <style> 
    .dataframe {text-align: left !important}
    //div.stButton > button:first-child { background-color: darkblue; color:white; } 
    </style>""", unsafe_allow_html=True)

st.subheader("License Application")
apply_folder = db.reference('apply_data/')
apply_data = apply_folder.get()
apply_license = {}
for key, value in zip(apply_data.keys(), apply_data.values()):
    one_data = {"Student_ID": [key]}
    for x, y in zip(value.keys(), value.values()):
        if x == 'LicenseNumber':
            apply_license[key] = y
        one_data[x] = [y]
    
    df = pd.DataFrame(one_data)
    
    c1, c2 = st.beta_columns([4, 1])
    
    with c1:
        AgGrid(df, height=80, theme='light') 

    with c2:
        accept = st.button("ACCEPT", key="Pass"+key)
        reject = st.button("REJECT", key="Reject"+key)

    if accept:
        st.info("will accept")
        ref = db.reference('account/'+key)
        ref.update({
            "license": apply_license[key],
        })
        ref = db.reference('apply_data/'+ key)
        ref.delete()
        ref = db.reference('validLicense')
        ref.update({
            apply_license[key]: "",
        })
    if reject:
        # for now, we will just remove the application, but not inform them for the failure
        st.info("will reject")
        ref = db.reference('apply_data/'+ key)
        ref.delete()

#############################################################
st.subheader("Invalid License")
ref = db.reference('invalidLicense/')
data = ref.get()
for d in data.keys():
    c1, c2, c3, _ = st.beta_columns([1, 1, 1, 3])
    with c1:
        st.write(d)
    with c2:
        OK = st.button("OK", key="OK"+d)
    with c3:
        if OK:
            st.info("OK")
            ref = db.reference('invalidLicense/'+ d)
            ref.delete()