# Wardrobe-Wizard

## Notice

This project is tested on **Google Chrome**. We highly recommend you run this project on the same browser for the best experience.
You will need to have these techniques available on your computer:
- Python (at least version 3.9 or above)
  You can download Python from the official Python website.
- pip
- Node.js (vesron v20.12.1)
  You can download Node.js from the official Node.js website.
- npm (version 10.5.0)
- React

## Getting Started

Follow these steps to get the project up and running on your local machine:

1. **Clone the Repository**

   Use Git to clone the code to your local machine:
   
   ```bash
   git clone https://github.com/SylviaHJY/Wardrobe-Wizard.git
   ```

2. **Open a Terminal in the Backend Directory**

   Install the required packages using pip:
   
   ```bash
   pip install -r requirements.txt
   ```

3. **Make Sure You Have a .flaskenv File in the Backend Root Directory**

   Normally, it has been uploaded to our GitHub repo under our backend root directory. If you don't have it, you will need to add a `.flaskenv` file manually.
   
   Add these two config codes to your `.flaskenv` file:
   
   ```bash
   FLASK_APP=main.py
   FLASK_ENV=development
   ```
   
   So that you will be able to run Flask (our backend supported by Flask) by this command:
   
   ```bash
   flask run
   ```
   
   Alternatively, you could run the Flask project by these commands in the terminal without having a `.flaskenv` file:
   
   For Windows:
   
   ```bash
   set FLASK_APP=main.py
   set FLASK_ENV=development  
   flask run
   ```
   
   For Unix/Linux/macOS:
   
   ```bash
   export FLASK_APP=main.py
   export FLASK_ENV=development
   flask run
   ```
   
   **Note**: Remember to delete all `__pycache__` directories (under src, core, and router files) after every time you terminate the terminal, so that you won't get errors once the code has been updated. 

4. **Open a Terminal in the React Frontend Directory**

   Install the required packages using npm:
   
   ```bash
   npm install
   ```

5. **Add a .env File in the Frontend Root Directory** Connact developers for necessary api keys if you have Authorization and Authentication of this project.
6. **Run the Project Locally With the Following Command:**

   ```bash
   npm start
   ```

7. **Access the Project**

   The project will be running at http://localhost:3000. Open this URL in Google Chrome to view the project.
