# CVMaker

CV Maker is a single-page application for displaying and managing a personal CV, including profile information, work experience, education, skills, documents, and professional links.

The application uses access-code-based authentication with administrator functionality for editing the CV and managing access codes. Access attempts are logged with location information, while the application is built with a responsive frontend and a PostgreSQL database.

## Additional Information

### Data Model

```mermaid
erDiagram
    profile_info ||--o{ work_experience : "contains"
    profile_info ||--o{ education : "contains"
    profile_info ||--o{ skill : "contains"
    profile_info ||--o{ document : "contains"

    profile_info {
      int id PK
      string full_name
      string professional_title
      string email
      string phone
      string country
      string profile_summary
      string linkedin_url
      string xing_url
      string github_url
      binary photo
      string photo_mime_type
    }

    work_experience {
      int id PK
      int profile_info_id FK
      string company_name
      string job_title
      string location
      date start_date
      date end_date
      boolean is_current
      string description
    }

    education {
      int id PK
      int profile_info_id FK
      string institution_name
      string qualification
      string field_of_study
      string location
      date start_date
      date end_date
      string description
    }

    skill {
      int id PK
      int profile_info_id FK
      string name
      string category
      string level
      number years_experience
    }

    document {
      int id PK
      int profile_info_id FK
      string title
      string category
      string description
      string external_url
      string file_name
      binary file_content
      string file_mime_type
      date issue_date
    }

    access_code ||--o{ access_log : "creates"

    access_code {
      string code PK
      string company
      boolean is_admin_code
    }

    access_log {
      string access_code_code PK, FK
      datetime access_time PK
      string country
      string city
    }
```

### Tools Used

[Visual Studio Code](https://code.visualstudio.com/)
[pgAdmin 4](https://www.pgadmin.org/)
[Supabase](https://supabase.com/)
[Vercel](https://vercel.com/)
[ChatGPT 5.6-Sol](https://chatgpt.com/)

### Resources Used

[MDN Web Docs](https://developer.mozilla.org/en-US/)
[StackOverflow](https://stackoverflow.com/)
[Material UI](https://mui.com/material-ui/)
[MUI X Date Pickers](https://mui.com/x/react-date-pickers/)
[Roboto Font](https://fonts.google.com/specimen/Roboto)
[Vite](https://vite.dev/)
[React](https://react.dev/)
[React Router](https://reactrouter.com/)
[Axios](https://axios-http.com/)
[Day.js](https://day.js.org/)
[Express](https://expressjs.com/)
[Prisma](https://www.prisma.io/)
[PostgreSQL](https://www.postgresql.org/)
[JSON Web Tokens](https://jwt.io/)
[IPWhois](https://ipwhois.io/)