import "./SuccessStories.css";

import couple1 from "../../assets/images/couples/couple1.jpg";
import couple2 from "../../assets/images/couples/couple2.jpg";
import couple3 from "../../assets/images/couples/couple3.jpg";

function SuccessStories() {

  const stories = [
    {
      image: couple1,
      names: "Alice & Jean",
      city: "Kigali",
      badge: "💍 Bashakanye",
      story:
        "Twahuriye kuri UMUHUZA.COM mu mwaka wa 2025. Twatangiye kuganira buri munsi, nyuma y'amezi make duhura imbonankubone. Uyu munsi turi umuryango wishimye kandi dushimira UMUHUZA.COM yaduhuje."
    },
    {
      image: couple2,
      names: "Aline & Patrick",
      city: "Huye",
      badge: "❤️ Bagiye Kurushinga",
      story:
        "Nari nkiri njyenyine imyaka myinshi. Niyandikishije kuri UMUHUZA.COM nshaka umuntu w'inyangamugayo. Nyuma y'ibyumweru bike nahuye n'urukundo rw'ubuzima bwanjye."
    },
    {
      image: couple3,
      names: "Diane & Eric",
      city: "Musanze",
      badge: "💕 Bamaranye Imyaka 2",
      story:
        "Sinari nzi ko urukundo nyarwo narusanga kuri internet. UMUHUZA.COM yadufashije guhura no kubaka icyizere. Uyu munsi turi kubaka ejo hazaza hamwe."
    }
  ];

  return (

    <section
  id="successful-stories"
  className="successful-stories"
>

      <h2>❤️ Inkuru z'Urukundo rw'Ukuri</h2>

      <p>
        Abakundanye bahuriye K'UMUHUZA.COM bakabona urukundo rw'ubuzima.
      </p>

      <div className="success-grid">

        {stories.map((story, index) => (

          <div className="success-card" key={index}>

            <img src={story.image} alt={story.names} />

            <div className="success-content">

              <span className="success-badge">
                ✔ Bahuriye kuri UMUHUZA.COM
              </span>

              <h3>{story.names}</h3>

              <h4>📍 {story.city}</h4>

              <p>{story.story}</p>

              <div className="married-badge">
                {story.badge}
              </div>

            </div>

          </div>

        ))}

      </div>

    </section>

  );
}

export default SuccessStories;