import "./Home.css";

import Hero from "../../components/Hero/Hero";
import MemberCard from "../../components/MemberCard/MemberCard";

import alineImage from "../../assets/images/members/aline.jpg";
import patrickImage from "../../assets/images/members/patrick.jpg";
import dianeImage from "../../assets/images/members/diane.jpg";

function Home() {

    return (

        <>

            <Hero />

            <section className="featured-members">

                <h2>Aha Niho Abahungu N'Abakobwa Bashaka Abakunzi Bahurira</h2>

                <p>
                    Discover verified members from Rwanda and Burundi looking for meaningful relationships.
                </p>

                <div className="members-grid">

                    <MemberCard
                        image={alineImage}
                        name="Aline"
                        age={24}
                        city="Kigali"
                        lookingFor="Marriage"
                        online={true}
                        verified={true}
                    />

                    <MemberCard
                        image={patrickImage}
                        name="Vincent"
                        age={26}
                        city="Huye"
                        lookingFor="Serious Relationship"
                        online={true}
                        verified={true}
                    />

                    <MemberCard
                        image={dianeImage}
                        name="Valence"
                        age={26}
                        city="Musanze"
                        lookingFor="Friendship"
                        online={true}
                        verified={true}
                    />

                </div>

            </section>

        </>

    );

}

export default Home;