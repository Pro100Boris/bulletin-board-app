import { Header } from './components/header';
import './App.scss';

function App() {
  return (
    <div className="app">
      <Header /> 
      <main className="main">
        {/* Контент будет здесь */}
      </main>
      <footer className="footer">
        {/* Подвал */}
      </footer>
    </div>
  );
}

export default App;