import "./AboutUs.css"
export const AboutUs = () => {

    return (
        <div className="container">
            <div className="about-wrap">
                <div className="row">
                    <div className="col-md-6">
                        <div className="floating-wrap">
                            <h4>Your Future, Our Mission</h4>
                            <p>
                                At Job Vista, we believe that finding the right job should be simple, efficient, and rewarding. Our mission is to connect talented individuals with their dream careers while helping companies discover the best candidates to join their teams.
                            </p>


                        </div>
                        <div className="floating-wrap">
                             <h4>How It Started</h4>
                            <p>
                                Founded in 2024, Job Vista was born out of a passion for transforming the job search experience. The idea for Job Vista originated as a university project, where a group of us noticed that the job market was becoming increasingly complex, with both job seekers and employers facing numerous challenges in finding the perfect match. Inspired by the potential to make a real difference, we decided to turn our project into a full-fledged platform. Our goal was to create an app that simplifies this process, making it easier for everyone involved.
                            </p>

                            <h4>What We Offer</h4>

                            <p><span className="start-title">Job Seekers </span>
                                can browse through thousands of job opportunities from various industries, all in one place. Enjoy an easy application process where you can apply for jobs with just a few clicks and track your applications seamlessly. Receive personalized job alerts about openings that match your skills and interests. Additionally, access a wealth of career resources, including articles, tips, and tools to help you prepare for interviews, improve your resume, and advance your career.</p>
                            <p>
                                <span className="start-title">Recruiters </span>
                                can post job openings and manage applications with our user-friendly interface, ensuring efficient recruitment. Find the best talent using our advanced search and filtering tools to discover candidates that fit your requirements. Enhance your brand visibility by showcasing your company and attracting top talent with a detailed company profile.
                            </p>

                            {/*<h4>*/}
                            {/*    Our Vision*/}
                            {/*</h4>*/}
                            {/*<p>*/}
                            {/*    We envision a world where job seekers and employers can effortlessly connect, leading to fulfilling careers and successful businesses. By leveraging technology and innovation, Job Vista aims to be the go-to platform for job hunting and recruitment.*/}
                            {/*</p>*/}
                        </div>
                    </div>
                    <div className="col-md-6">


                        <div className="row">
                            <img className="about-us-img" src="/images/about-us.jpg" alt=""/>
                        </div>
                        <div className="row">
                            <div className="floating-wrap">
                                {/*<h4>*/}
                                {/*    Join Us*/}
                                {/*</h4>*/}

                                {/*<p>*/}
                                {/*    Whether you're looking for your next job opportunity or searching for the perfect candidate, Job Vista is here to support you every step of the way. Join our community today and take the next step towards a brighter future.*/}
                                {/*</p>*/}
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="floating-inside-wrap">
                                            <h2>120</h2>
                                            <p>Total Recruiters</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="floating-inside-wrap">
                                            <h2>2400+</h2>
                                            <p>Total Job Seekers</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="floating-inside-wrap">
                                            <h2>240</h2>
                                            <p>Total Job Listings</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="floating-inside-wrap">
                                            <h2>4000+</h2>
                                            <p>Total Applications</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}