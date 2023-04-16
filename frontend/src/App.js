import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ServiceRequests from './pages/ServiceRequests';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path ="/" element={<ServiceRequests/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
