Patient Registration App
This is a frontend-only patient registration application built with HTML, CSS, and JavaScript, leveraging Pglite for robust, client-side data storage. It allows users to register new patients, query patient data using raw SQL, and ensures data persistence and synchronization across multiple browser tabs.

✨ Features
Patient Registration: Easily register new patient records with details like name, date of birth, gender, and address.
Raw SQL Querying: Powerfully query patient data directly in the browser using familiar SQL commands.
Data Persistence: All patient data is stored locally using Pglite (which leverages IndexedDB), ensuring your records remain intact even after page refreshes.
Multi-Tab Synchronization: Experience seamless updates across multiple browser tabs open to the application, thanks to BroadcastChannel for real-time UI synchronization.
🚀 Technologies Used
HTML: For the application's structure.
CSS: For styling and a clean user interface.
JavaScript: For all application logic and interactivity.
Pglite: A WebAssembly build of PostgreSQL that runs entirely in the browser, providing a powerful SQL database directly on the client side.

🛠️ Setup and Installation
To get this project up and running on your local machine, follow these simple steps:

Clone the repository:

Bash

git clone https://github.com/singhpratik-17/Patient_Registration_App.git
cd Patient_Registration_App

Install dependencies:
This project uses Pglite which needs to be installed.

npm install



🚧 Challenges Faced During Development
Developing this application presented a few interesting challenges:

Pglite Integration: While Pglite is powerful, integrating a WebAssembly database into a pure frontend environment required careful asynchronous handling (async/await) to ensure database operations completed before subsequent actions.
Multi-tab Synchronization: Achieving seamless real-time updates across multiple browser tabs was a key requirement. Implementing BroadcastChannel effectively was crucial to notify other tabs about data changes, prompting them to refresh their UI.
SQL Injection Awareness (for Raw SQL Input): The requirement to allow raw SQL queries directly from the user highlighted a significant security consideration (SQL injection). While implemented as per the prompt's requirements for this demo, it's critical to note that in a production application, raw SQL input for write operations would not be allowed due to severe security risks. For this project, it serves as a demonstration of Pglite's querying capabilities.
Initial Load Performance: As Pglite is a WebAssembly bundle, its initial load size could be a consideration for larger, more complex applications where optimizing first contentful paint is paramount. For this application, it's generally not an issue.
