from flask import Flask, jsonify, request
import time
import pickle
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
import selenium
from flask_cors import CORS
import requests  # Add this at the top with other imports

app = Flask(__name__)
CORS(app)

# In-memory storage for cards (replace with database in production)
cards = []

# Add a test endpoint
@app.route('/test', methods=['GET'])
def test():
    return jsonify({"status": "success", "message": "Flask server is running"}), 200

@app.route('/restaurant-booking', methods=['POST'])
def restaurant_booking():
    try:
        # Get data from request
        data = request.json
        
        # Validate required fields
        required_fields = ['start', 'attendee', 'eventTypeId']
        if not all(key in data for key in required_fields):
            return jsonify({
                "status": "error", 
                "message": f"Missing required fields. Required: {', '.join(required_fields)}"
            }), 400
            
        # Validate attendee fields
        required_attendee_fields = ['name', 'email', 'timeZone']
        if not all(key in data['attendee'] for key in required_attendee_fields):
            return jsonify({
                "status": "error", 
                "message": f"Missing required attendee fields. Required: {', '.join(required_attendee_fields)}"
            }), 400
            
        # Prepare the booking request
        booking_data = {
            "start": data['start'],
            "eventTypeId": data['eventTypeId'],
            "attendee": {
                "name": data['attendee']['name'],
                "email": data['attendee']['email'],
                "timeZone": data['attendee']['timeZone']
            }
        }
        
        # Make the API call to Cal.com with corrected header format
        response = requests.post(
            'https://api.cal.com/v2/bookings',
            json=booking_data,
            headers={
                'Authorization': f'Bearer cal_live_b6226415113938985fcf74dccdbd4573',
                'cal-api-version': '2024-08-13'
            }
        )
        
        # Check if the request was successful
        if response.ok:
            return jsonify({
                "status": "success",
                "message": "Restaurant booking created successfully",
                "data": response.json()
            }), 201
        else:
            return jsonify({
                "status": "error",
                "message": f"Failed to create booking: {response.text}"
            }), response.status_code
            
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/cards', methods=['POST'])
def create_card():
    try:
        # Get data from request
        data = request.json
        
        # Validate required fields
        if not data.get('title'):
            return jsonify({"status": "error", "message": "Title is required"}), 400
            
        if not data.get('columnType'):
            return jsonify({"status": "error", "message": "Column type is required"}), 400
            
        # Create new card
        new_card = {
            'id': len(cards) + 1,
            'title': data.get('title'),
            'roomNumber': data.get('roomNumber'),
            'columnType': data.get('columnType'),
            'created_at': time.time()
        }
        
        # Forward the request to Next.js frontend
        try:
            frontend_response = requests.post(
                'http://localhost:3000/api/cards',
                json=new_card,
                headers={'Content-Type': 'application/json'}
            )
            
            if not frontend_response.ok:
                return jsonify({
                    "status": "error",
                    "message": f"Failed to create card in frontend: {frontend_response.text}"
                }), 500
                
            # If frontend creation successful, store in local memory
            cards.append(new_card)
            
            return jsonify({
                "status": "success",
                "message": "Card created successfully in both backend and frontend",
                "data": new_card
            }), 201
            
        except requests.RequestException as e:
            return jsonify({
                "status": "error",
                "message": f"Failed to connect to frontend: {str(e)}"
            }), 500
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# Get all cards
@app.route('/api/cards', methods=['GET'])
def get_cards():
    return jsonify({
        "status": "success",
        "data": cards
    }), 200

def book_uber_ride(destination):
    # Configure Chrome options
    options = uc.ChromeOptions()
    options.add_argument('--user-data-dir=C:\\Users\\USER\\AppData\\Local\\Google\\Chrome\\User Data')
    options.add_argument("--profile-directory=Default")
    # Remove headless mode for testing
    # options.add_argument('--headless')
    
    # Add these options to help with stability
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1920,1080')

    driver = None
    try:
        driver = uc.Chrome(options=options)
        
        # Load cookies if they exist
        try:
            with open("cookies.pkl", "rb") as file:
                cookies = pickle.load(file)
                for cookie in cookies:
                    driver.add_cookie(cookie)
        except FileNotFoundError:
            print("No saved cookies found. Please log in manually.")

        try:
            # 2. Navigate to your page
            driver.get("https://m.uber.com/go/home?marketing_vistor_id=ed1613ce-3279-4562-ba87-e588f58c4549&pickup=%7B%22addressLine1%22%3A%22UCL%20Main%20Building%22%2C%22addressLine2%22%3A%22Gower%20St%2C%20London%2C%20WC1E%206BT%2C%20GB%22%2C%22id%22%3A%22b9fd94b2-ef6b-a5e4-b60c-53e67d92e714%22%2C%22source%22%3A%22SEARCH%22%2C%22latitude%22%3A51.5246863%2C%22longitude%22%3A-0.1334378%2C%22provider%22%3A%22uber_places%22%7D")

            # First, click the parent div to make the input visible/active
            destination_input = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((
                    By.CSS_SELECTOR, 
                    'div[class="_css-gHAfEC"]'
                ))
            )
            destination_input.click()
            time.sleep(1)  # Increased delay after clicking

            # Then find and interact with the input element inside
            destination_input2 = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((
                    By.CSS_SELECTOR, 
                    'input[aria-controls="bui7"][class="_css-hqBMbI"]'
                ))
            )
            
            # Try to ensure the input is ready
            driver.execute_script("arguments[0].focus();", destination_input2)
            time.sleep(0.5)
            
            # Send keys to the input field
            destination_input2.clear()  # Clear any existing text
            destination_input2.send_keys(destination)
            time.sleep(2)  # Increased wait time for suggestions to load

            # Function to retry clicking the first option
            def click_first_option():
                max_attempts = 3
                for attempt in range(max_attempts):
                    try:
                        # Wait for and click the first option
                        first_option = WebDriverWait(driver, 10).until(
                            EC.element_to_be_clickable((
                                By.CSS_SELECTOR, 
                                'li[role="option"][data-testid="pudo-result"]:first-child'
                            ))
                        )
                        first_option.click()
                        return True
                    except Exception as e:
                        print(f"Attempt {attempt + 1} failed: {str(e)}")
                        if attempt == max_attempts - 1:
                            raise
                        time.sleep(1)
                return False

            # Function to retry clicking the search button
            def click_search_button():
                max_attempts = 3
                for attempt in range(max_attempts):
                    try:
                        search_button = WebDriverWait(driver, 10).until(
                            EC.element_to_be_clickable((
                                By.CSS_SELECTOR, 
                                'button[data-baseweb="button"][class="_css-hUNeqW"]'
                            ))
                        )
                        time.sleep(1)
                        search_button.click()
                        return True
                    except Exception as e:
                        print(f"Search button click attempt {attempt + 1} failed: {str(e)}")
                        if attempt == max_attempts - 1:
                            raise
                        time.sleep(1)
                return False

            # Function to retry clicking the request button
            def click_request_button():
                max_attempts = 3
                for attempt in range(max_attempts):
                    try:
                        request_button = WebDriverWait(driver, 10).until(
                            EC.element_to_be_clickable((
                                By.CSS_SELECTOR, 
                                'button[data-testid="request_trip_button"][data-tracking-name="request_pickup_button"]'
                            ))
                        )
                        time.sleep(1)
                        request_button.click()
                        return True
                    except Exception as e:
                        print(f"Request button click attempt {attempt + 1} failed: {str(e)}")
                        if attempt == max_attempts - 1:
                            raise
                        time.sleep(1)
                return False

            # Try to click the first option
            click_first_option()
            
            # Try to click the search button
            click_search_button()

            # Wait a bit for the ride options to load
            time.sleep(1)
            
            # Try to click the request button
            click_request_button()

            # 7. Pause briefly to see the result
            time.sleep(5)
            time.sleep(180)  # Just an example wait to let you log in or handle pop-ups

            # After you are logged in, save the cookies to a file
            cookies = driver.get_cookies()
            with open("cookies.pkl", "wb") as file:
                pickle.dump(cookies, file)

            # Return success response
            return {"status": "success", "message": "Uber ride requested successfully"}

        except Exception as e:
            return {"status": "error", "message": str(e)}

    except Exception as e:
        return {"status": "error", "message": str(e)}

    finally:
        if driver:
            driver.quit()

@app.route('/book-uber', methods=['POST'])
def book_uber_endpoint():
    try:
        # Get destination from request JSON
        destination = request.json.get('destination')
        if not destination:
            return jsonify({"status": "error", "message": "Destination is required"}), 400
        
        result = book_uber_ride(destination)
        return jsonify(result)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask server...")
    print(f"Selenium version: {selenium.__version__}")
    print(f"undetected_chromedriver version: {uc.__version__}")
    app.run(debug=True, port=5001, host='0.0.0.0')  # Added host parameter