# Exhibit: the MET x the AIC

A web application for browsing and curating art exhibits from the Metropolitan Museum of Art and The Art Institute of Chicago's APIs. 

# Hosted Websites

- Frontend: https://exhibitmetxaic.netlify.app/
- Backend: https://exhibit-mw48.onrender.com/

# Features
- Browse artworks from museum collections
- Search and filter by various criteria
- Create and add artworks to personal exhibits
- Exhibits are stored + saved.
  
# Tech Stack

-React
-Javascript
-CSS
-Vite
-Axios
-HTML 
-Node.js
-Express.js
-PostgreSQL
-External APIs (Metropolitan Museum of Art and The Art Institute of Chicago)

# Run it Locally
  
  # Frontend 
- Clone the frontend repo with
   ``` git clone https://github.com/tigejw/exhibit.git ``` 
- Install dependencies with 
  ``` npm install``` 
- Start development server with
 ``` npm run dev``` 
- Open the localhost:xxxx link in your browser.

  # Backend 
- Clone the backend repo with
  ``` git clone https://github.com/tigejw/exhibit-be.git``` 
- Install dependencies with
  ``` npm install``` 
- Set up your environment variables in `.env.development`:
``` PGDATABASE = your_database_name``` 
- Set up and seed the database with
  ``` npm run setup-dbs``` 
  ```  npm run seed ``` 
- Start the server with
  ``` npm run dev``` 
- The API will be available at http://localhost:9090


Be aware that if you want to run the local front and backend together, 
you will need to change the API URLs in the front end from 'https://exhibit-mw48.onrender.com/' to 'http://localhost:9090' 


