import "./WhyChooseKundwa.css";

import {
  FaGift,
  FaShieldAlt,
  FaUserCheck,
  FaHeart
} from "react-icons/fa";

function WhyChooseKundwa() {

  const reasons = [

    {
      icon: <FaGift />,
      title: "Free to Start",
      text: "Create your account, browse members and start connecting for free."
    },

    {
      icon: <FaShieldAlt />,
      title: "Safe & Secure",
      text: "Your privacy is protected and chats are secured for a safer experience."
    },

    {
      icon: <FaUserCheck />,
      title: "Verified Members",
      text: "We encourage profile verification to help reduce fake accounts."
    },

    {
      icon: <FaHeart />,
      title: "Built for Serious Connections",
      text: "UMUHUZA.COM is designed for genuine relationships, friendship and marriage."
    }

  ];

  return (

    <section className="why">

      <div className="animated-bg"></div>

      <h2>⭐ Why Choose UMUHUZA?</h2>

      <p>
        We are building the safest and most trusted dating community in Rwanda and Burundi.
      </p>

      <div className="why-grid">

        {reasons.map((item,index)=>(

          <div className="why-card" key={index}>

            <div className="why-icon">

              {item.icon}

            </div>

            <h3>{item.title}</h3>

            <p>{item.text}</p>

          </div>

        ))}

      </div>

    </section>

  );

}

export default WhyChooseKundwa;