# DriveMaster

DriveMaster is a user-friendly web application designed to provide a graphical interface for managing files on Amazon S3. It simplifies file operations like uploading, downloading, and organizing folders, making cloud storage more accessible and intuitive.

## Features

- **Intuitive UI**: A clean and responsive interface that makes file management easy.
- **Folder Management**: Create, delete, and organize folders to structure your files efficiently.
- **File Uploads**: Drag and drop files for quick uploads, or select files from your device.
- **Real-time Updates**: Seamless updates and notifications for actions taken on files.
- **Secure Access**: User authentication and permissions to ensure that your files are safe.
- **Integration with AWS**: Directly interacts with Amazon S3 for reliable file storage.

## Getting Started

### Prerequisites

1. Node.js and npm installed on your machine.
2. An AWS account with an S3 bucket set up.

### Installation

- Clone the repository: `https://github.com/c-w-d-harshit/drivemaster.git`
- Navigate to the project directory: `cd drivemaster`
- Install the dependencies: `npm install`

### Configuration

Create a `.env` file in the root directory and add your AWS credentials:

```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
BUCKET_NAME=your_bucket_name
```

Start the development server: `npm run dev`

## Usage

- Access the application at `http://localhost:3000`.
- Use the UI to upload, manage, and organize your files in S3.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
