import Home from './pages/Home';
import AdminUpload from './pages/AdminUpload'; // Import it

function App() {
  return (
    <div>
      {/* Show the Admin Form at the top */}
      <AdminUpload />
      
      <hr style={{margin: "40px 0", border: "1px solid #eee"}}/>
      
      <Home />
    </div>
  );
}

export default App;