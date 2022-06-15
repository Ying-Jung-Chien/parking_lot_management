### Script for CS329s ML Deployment Lec 
import os
import json
import requests
import SessionState
import streamlit as st
import tensorflow as tf
from utils import load_and_prep_image, classes_and_models, update_logger, predict_json
import time

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
st.title("Welcome to License Plate Recognition")
st.header("You may upload a photo to upload the plate number onto the database!")

# @st.cache(suppress_st_warning=True) # this means the function will only run once in a session
def detect_text(content):
    print("detect_text")
    """Detects text in the file."""
    client = vision.ImageAnnotatorClient()

    image = vision.Image(content=content)

    response = client.text_detection(image=image)
    texts = response.text_annotations
    
    global text_detected
    text_detected = ""
    for ch in texts[0].description:
        if (ord(ch) >= 65 and ord(ch) <= 90) or (ord(ch) >= 48 and ord(ch) <= 57):
            text_detected += ch

    st.write('Text:', text_detected)

    if response.error.message:
        raise Exception(
            '{}\nFor more info on error messages, check: '
            'https://cloud.google.com/apis/design/errors'.format(
                response.error.message))

# @st.cache(suppress_st_warning=True)
def write_data():
    print("write_data")
    ref = db.reference('License plates/'+text_detected)
    ref.push({
        "enter": enter,
        "time": time.ctime()
    })

    if enter == "yes":
        ref = db.reference('validLicense/')
        data = ref.get()
        valid = False
        for d in data.keys():
            if text_detected == d:
                valid = True
        if valid == False:
            ref = db.reference('invalidLicense/')
            ref.update({
                text_detected: "",
            })

    st.write("Plate Number and Time successfully uploaded to database!")



# File uploader allows user to add their own image
uploaded_file = st.file_uploader(label="Upload an image of food",
                                 type=["png", "jpeg", "jpg"])
enter = st.selectbox(
        "Is it entering the parking lot?",
        ("Select an option", "yes", "no"))

# Setup session state to remember state of app so refresh isn't always needed
# See: https://discuss.streamlit.io/t/the-button-inside-a-button-seems-to-reset-the-whole-app-why/1051/11 
session_state = SessionState.get(pred_button=False)

# Create logic for app flow
if not uploaded_file:
    st.warning("Please upload an image.")
    st.stop()
else:
    session_state.uploaded_image = uploaded_file.read()
    st.image(session_state.uploaded_image, use_column_width=True)
    pred_button = st.button("Predict")


# Did the user press the predict button?
if pred_button:
    # session_state.pred_button = True
    if enter == "Select an option": 
        st.warning("Please select whether the motorcycle is entering or not!")
    else:
        detect_text(session_state.uploaded_image) # test cloud vision
        write_data() # test firebase
    