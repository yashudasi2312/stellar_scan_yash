import './CSS/AboutCSS.css';
import React, { useEffect } from 'react';

export default function About() {
    useEffect(() => {
        const createStars = () => {
            const starsContainer = document.querySelector('.stars-container');
            if (!starsContainer) return;

            starsContainer.innerHTML = '';

            for (let i = 0; i < 30; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.animationDelay = Math.random() * 4 + 's';
                star.style.animationDuration = (Math.random() * 2 + 1) + 's';

                const size = Math.random() * 3 + 1;
                star.style.width = size + 'px';
                star.style.height = size + 'px';

                starsContainer.appendChild(star);
            }
        };

        createStars();
    }, []);

    return (
        <div className="about-container">
            <div className="stars-container"></div>

            <h1 className="fade-in-title">About StellarScan</h1>
            <div className="fade-in-content">
                
                  <p>
                Hi there, Yash this side.
            </p>

            <p>
                I have been fascinated with space exploration from a very young age (thank you Discovery Network). And not just space <i>exploration</i>, per se.
                You can strike up a conversation regarding Apollo, Cosmonauts, Saturn-V with me as well as about planets, black holes and extraterrestrial life,
                the latter being my favorite discussion topic for which I will always have the time to talk about.
            </p>

            <p>
                This entire thing was a way for me to actually use my love for space in some way which could serve some purpose and gladly it does. I am happy with the result
                and I'm proud of it. If this was something which I had no interest in and wasn't getting paid for it, I would have had a real hard time bringing
                myself to work on it from morning to night. But it is and that kept me going; had a fun time working on it. And of course, learnt a lot
                about various technologies and how they contributed to the final product.
            </p>

            <p>
                The initial plan was to make it so that a user enters a NORAD ID of <i>his </i> choice
                and upon clicking that 'GO' button he would be redirected to a page which would show the satellite's position on the world map, and I even generated
                an N2YO API key for that (using a fake American number, since the key could only be generated using a US number). But for some reason, I couldn't get the API to work.
                It just wasn't working and that reduced the scale of the project by quite a significant margin. So unfortunately I had to hardcode key-value pairs of NORAD IDs and their respective satellite names.
                I was then on the lookout for a place from where I could get the API which gets me a limited number of satellites with their Two-Line Element (TLE) 
                sets  and I found Ivan Stanojevic's TLE API to be of massive
                help for that. So if he's reading this, I would just like to say a big thank you to him for making that API available for free.
            </p>

            <p>Now we got the satellite info, but where the hell is it currently going over? First, I used satellite.js to convert the TLE lines into real-time latitude and longitude
                and sent that data to my backend server where I used Geoapify API key which helped reverse geocode the satellite's latitude and longitude and the backend then sent it back 
                to React which displayed the name of the country the satellite was over (or just "over the ocean" if it wasn't over any piece of land). 
            </p>

            <p>
                I also wanted every visual thing to be of the highest quality I could use without compromising on the app's performance, which led to me using a 10K resolution image of the Earth. 
                I kid you not, I downloaded a 54MB, <i>16K, 21600x21600 </i> globe texture from NASA's website to integrate into the project but it just took too long to load, so I made peace with the 10K one.
                I also had plans for the home page footage to be exported in 4K, but that plan also had to be scrapped. 
            </p>

            <p>
                I can think of a million other things I could have done to make this project better, but I had to draw the line somewhere. But still, I'll say, for my first fullstack project, 
                this honestly turned out to be good. I tried making it visually appealing and functionally not-very-diverse because of time constraints, and I think I did a decent job at both of them 
                especially on the former. As for future projects, I will try making them more backend heavy but for this one, I just wanted to gain experience with frontend and backend running at the same time, 
                and I can say with a high degree of certainty that I did well on both fronts. 
            </p>

            <p>That is pretty much all I can think of writing about the project at the moment. If you read this far, you're a real one. </p>

            <p>
                Peace.
            </p>


            </div>
        </div>
    );
}