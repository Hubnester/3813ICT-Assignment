# 3813ICT Assignment

## Git
The git repository has the server folder (for the backend) and the src folder from the angular project as well as a few angular config files. The repository has 2 branches. One of them (named phase-1) has all the stuff done for the phase 1 submission. The other one (named phase-2) will be where all the stuff for the phase 2 submission will be done. This will be merged into master before submission. The approach that was taken for version control was to make a new commit after a milestone was achieved (e.g adding the ability to create groups).

## Data Structures
The main data for the server is stored as a json object. This object has two main parts: users and groups. The users are stored as a map with the key being the username and the value being an object that contains the data for the user. The current data that users can have is their email as a string, the role as a string and an array of the names of groups that they are a group assistant for. The groups are also stroed as a map with the key being the group name and the value being an object that contains the data for the group. The current data that groups can have is an object that contains the channels and an array that contains the usernames of the users that have access to the group. The object that contains the channels for a group is a map with 

## Routes


## Architecture

