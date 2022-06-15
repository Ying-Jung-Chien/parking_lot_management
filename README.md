# Parking Lot Management Project
## The introduction about the project
We combine a cloud AI model and database to build an app, a parking lot management tool. The app features a variety of functions, including displaying the record of vehicles entering and exiting the parking lot, sending messages to other users, reading messages from other users, and checking the validation of vehicle permission. Therefore, this app can greatly reduce the manpower spent on managing parking lots and increase the efficiency of management.

## The used techniques / tools / algorithms

### Google Cloud vision API
Google Cloud vision API is a tool that classifies images, detects individual objects, faces, and pieces of text by AutoML Vision.
We use Google Cloud vision API to recognize a license plate from an input image of a motorcycle.
### Firebase
Firebase is a product of Google that helps developers build, manage, and grow their apps easily. The services are hosted in the cloud and scale with little to no effort on the part of the developer. 
We use Realtime Database, Firestore Database and Storage to store and synchronize our data.
### React native expo
Expo is a framework for quickly developing React Native apps. Expo provides a layer on top of the React Native APIs to make them easier to use and manage. It also provides tools that make it easier to bootstrap and test React Native apps. 
'react-native-gifted-chat' SDK
It is a SDK for building one-to-one chat apps, and we use it to build a many-to-one message board to display the messages we receive.
### Streamlit
Streamlit is an open-source app framework in Python language. It helps us create web apps for data science and machine learning in a short time.

## The explanation about the innovation.
We found problems with the school motorcycle parking lot, such as
People without validated permission can still enter.
The number of empty parking spaces is unknown.
It is hard to manage.
Hence, we want to create an app to manage the parking lot easily and efficiently. We don't even need to build up fences, just add a camera at the entrance. We do license plate recognition and upload the results to the database. The supervisor will then know who entered the parking lot and whether he or she has validated permission. In addition, users (students) can view the entry/exit records through the APP, send messages to remind others that they have forgotten to remove their keys, or apply for parking permissions.

Currently, there is no auto parking management system used for our university. Most of the works are done manually, however, due to the requirement of manpower to check the vehicles one by one, the vehicles in the parking lot are rarely inspected.
