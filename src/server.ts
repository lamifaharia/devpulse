import app from "./app/app";

// Changed from 5000 to 5001 to clear macOS port blocks
const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});