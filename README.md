# URL Shortener

Welcome to the URL Shortener project! This application allows users to shorten long URLs for easier sharing and tracking. The project is built using React for the frontend, Tailwind CSS for styling, Supabase for the backend, and Shadcn for component management.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)

## Features

- Shorten long URLs to a more manageable length
- Track the number of clicks on shortened URLs
- Also keep records of the number of links created
- Have implemented a pie chart to view the devices where you have made clicks and re-created a new url
- Custom aliases for shortened URLs
- Responsive design

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/url-shortener.git
   cd url-shortener
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up Supabase:**

   - Create a Supabase project at [supabase.io](https://supabase.io)
   - Obtain the Supabase URL and public anon key from your project settings
   - Create a `.env` file in the root of the project and add your Supabase credentials:

   ```plaintext
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server:**

   ```bash
   npm start
   ```

   Your application should now be running on `http://localhost:3000`.

## Usage

1. Enter a long URL into the input field.
2. Click the "Shorten" button.
3. Copy the shortened URL and use it as needed.
4. Track the number of clicks on the "Stats" page.

## Technologies Used

- **React:** JavaScript library for building user interfaces
- **Tailwind CSS:** Utility-first CSS framework for styling
- **Supabase:** Backend-as-a-service providing database and authentication
- **Shadcn:** Component management system

## Contributing

I welcome all the contributions for the betterment of my project! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b my-feature-branch`
3. Make your changes and commit them: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin my-feature-branch`
5. Submit a pull request.
