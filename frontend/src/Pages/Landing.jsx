import React from 'react';
import './CSS/Landing.css';
import Hero from '../Component/Hero/Hero';
import Features from '../Component/Features/Features';

export default function Landing() {
    return (
        <div className='landing-container'>
            <Hero/>
            <Features/>
        </div>
    );
};
