import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHeart, FiMessageCircle, FiEye, FiBookOpen } from "react-icons/fi";
import umurangaLogo from "../../assets/umuranga.logo/UMURANGA.COM.png";
import { useMemo } from "react";

// Import the 9 images
import post1 from "../../assets/menyanibi/post1.jpg";
import post2 from "../../assets/menyanibi/post2.jpg";
import post3 from "../../assets/menyanibi/post3.jpg";
import post4 from "../../assets/menyanibi/post4.jpg";
import post5 from "../../assets/menyanibi/post5.jpg";
import post6 from "../../assets/menyanibi/post6.jpg";
import post7 from "../../assets/menyanibi/post7.jpg";
import post8 from "../../assets/menyanibi/post8.jpg";
import post9 from "../../assets/menyanibi/post9.jpg";

import "./Menyanibi.css";

const posts = [
  {
    id: "1",
    title: "Dore ibimenyetso 10 bikwereka ko umukobwa akwiyumvamo",
    category: "Crush",
    likes: "1.8k",
    comments: "47",
    views: "12.4k",
    preview: "Yumva mwahorana, ashimishwa no kuganira nawe, akwereka inshuti ze...",
    image: post1,
  },
  {
    id: "2",
    title: "Dore Ibintu 5 bikwereka ko uwo wita umukunzi atanagutekereza",
    category: "Warning",
    likes: "1.3k",
    comments: "38",
    views: "9.7k",
    preview: "Ntaguha umwanya, akugereranya n’abandi, ntiyifuza kuganira ku hazaza...",
    image: post2,
  },
  {
    id: "3",
    title: "IBINTU 5 BIKWEREKA KO UMUHUNGU MUKUNDANA ATAGUTENDEKA KANDI ATAKURYARYA",
    category: "Love",
    likes: "2.4k",
    comments: "61",
    views: "15.2k",
    preview: "Akwereka inshuti n’abavandimwe be, akubonamo umuntu udasimburwa...",
    image: post3,
  },
  {
    id: "4",
    title: "IBIMENYETSO BIKWEREKA KO UMUKUNZI WAWE ADAFITE IGITEKEREZO CYO KUBA YABANA NAWE",
    category: "Warning",
    likes: "3.1k",
    comments: "89",
    views: "18.6k",
    preview: "Amagambo ye ntahuza n’ibikorwa bye, aba hafi yawe iyo bimufitiye inyungu gusa...",
    image: post4,
  },
  {
    id: "5",
    title: "INGARUKA 5 ZO KURYAMANA N’UMUSORE MUKUNDANA MUTARASHINGA URUGO",
    category: "Warning",
    likes: "3.8k",
    comments: "112",
    views: "22.1k",
    preview: "Umusore mwaryamanye ashobora kutagukumbura nka mbere...",
    image: post5,
  },
  {
    id: "6",
    title: "IBINTU 10 BIZAKWEREKA KO UMUKOBWA AGUKUNDA ARIKO YABUZE UKO ABIKUBWIRA",
    category: "Crush",
    likes: "2.7k",
    comments: "73",
    views: "14.8k",
    preview: "Inseko, akunda kukureba cyane, ibimenyetso by’umubiri...",
    image: post6,
  },
  {
    id: "7",
    title: "IBIMENYETSO 6 BIKWEREKA KO UMUKOBWA MUKUNDANA ASHISHIKAJWE N’AMAFARANGA YAWE KURUTA URUKUNDO",
    category: "Warning",
    likes: "3.5k",
    comments: "95",
    views: "19.3k",
    preview: "Ntajya agushishikariza kwizigamira, gutumiza nta rutangira...",
    image: post7,
  },
  {
    id: "8",
    title: "AMAGAMBO MEZA 10 WABWIRA UMUKUNZI WAWE MBERE YO KUJYA KURYAMA",
    category: "Love",
    likes: "2.1k",
    comments: "54",
    views: "11.5k",
    preview: "Nta wundi muntu nifuza kuba ndi kumwe na we...",
    image: post8,
  },
  {
    id: "9",
    title: "AMAGAMBO 15 MEZA WABWIRA UMUKOBWA UKUNDA",
    category: "Love",
    likes: "2.9k",
    comments: "68",
    views: "16.4k",
    preview: "Kuba uri mu buzima bwanjye byanyeretse ko urukundo rw’ukuri rubaho...",
    image: post9,
  },
];
function Menyanibi() {
  const navigate = useNavigate();

  // Shuffle posts randomly every time the page loads
  const shuffledPosts = useMemo(() => {
    return [...posts].sort(() => Math.random() - 0.5);
  }, []);

  return (
    <div className="menyanibi-page">
      {/* Header */}
      <div className="menyanibi-header">
        <button className="back-btn" onClick={() => navigate("/member-home")}>
          <FiArrowLeft /> Back
        </button>
        <div className="menyanibi-logo">
          <img src={umurangaLogo} alt="UMUHUZA" style={{ height: 36 }} />
        </div>
      </div>

      {/* Intro */}
      <div className="menyanibi-intro">
        <h1>📖 Menyanibi</h1>
        <p>Inama z’urukundo n’ibimenyetso by’ukuri</p>
      </div>

      {/* Posts List - now using shuffledPosts */}
      <div className="menyanibi-list">
        {shuffledPosts.map((post) => (
          <div key={post.id} className="menyanibi-card">
            {/* Real Photo */}
            <div className="post-cover">
              <img src={post.image} alt={post.title} />
            </div>

            <div className="menyanibi-card-body">
              <div className="menyanibi-card-top">
                <span className={`post-tag ${post.category.toLowerCase()}`}>
                  {post.category}
                </span>
              </div>

              <h3 className="post-title-green">{post.title}</h3>
              <p>{post.preview}</p>

              <div className="menyanibi-card-stats">
                <span><FiHeart /> {post.likes}</span>
                <span><FiMessageCircle /> {post.comments}</span>
                <span><FiEye /> {post.views}</span>
              </div>

              <button
                className="read-more-btn"
                onClick={() => navigate(`/menyanibi/${post.id}`)}
              >
                Soma byinshi →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menyanibi;