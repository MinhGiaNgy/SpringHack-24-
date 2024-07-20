import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Features from './Features';
import './index.css';

const App: React.FC = () => {
    return (
        <div className="App">
            <Navbar />
            <main>
                <Hero />
                <Features />
            </main>
        </div>
    );
};

export default App;
