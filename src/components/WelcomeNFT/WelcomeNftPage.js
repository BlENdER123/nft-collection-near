import React from "react";
import {HashRouter as Router, useNavigate} from "react-router-dom";

import {
  Link,
  Element,
} from "react-scroll";

function WelcomeNftPage() {
  let navigate = useNavigate();

  return (
    <>
      <div className={"App"}>
        {/*<Header activeCat={0}></Header>*/}

        <div className="main-screen">
          <div className="container">
            <div className="content">
              <div className="title">
                Create your own NFT collections easy and fast
              </div>
              <div className="text">
                Download or generate more than 15,000 unique NFT arts with no
                code in user-friendly interface.
              </div>
              <div className="buttons">
                <a
                  onClick={(ev) => {
                    ev.preventDefault();
                    navigate("/load-nft");
                  }}
                >
                  <button className="button-1">Get started</button>
                </a>
                <Link to="video">
                  <button className="button-2">How it work</button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="quality-screen">
					<div className="container">
						<div className="content">
							<div className="title">Pure Creativity</div>
							<div className="text">
								NFT art creator’s main goal is to invent, and using NFTour
								artists and designers can do just that without wasting precious
								time on trying to understand code. You can create your NFT
								collection using our base with pics or upload your own NFT arts
								by setting different parameters.
							</div>

							<div className="quality-list">
								<div className="quality-element">
									<div className="quality-title">Simple to use</div>
									<div className="quality-text">
										No need for coding. All you need to do is create your own
										layers and indicate your assets then click generate.
									</div>
								</div>
								<div className="quality-element">
									<div className="quality-title">Upload images</div>
									<div className="quality-text">
										You will be able to compile the NFT collection from our base
										or convey your own arts. In any case you will be able to
										create a collection in your favorite format.
									</div>
								</div>
								<div className="quality-element">
									<div className="quality-title">Layer Uniqueness </div>
									<div className="quality-text">
										In a huge collection you might not want to put layers in
										every NFT. You can compose a level of rarity and then will
										be bid only certain number of times.
									</div>
								</div>
								<div className="quality-element">
									<div className="quality-title">Characteristic rarity</div>
									<div className="quality-text">
										You can configure certain traits to be more rarer than
										others the same way as with layers. It will be easy to
										differentiate the changes of the characteristics that will
										be applied.
									</div>
								</div>
								<div className="quality-element">
									<div className="quality-title">Autosaving</div>
									<div className="quality-text">
										Your work will automatically be saved in the browser, so
										that when you get back, your layers, configurations and
										files will still be there.{" "}
									</div>
								</div>
								<div className="quality-element">
									<div className="quality-title">Customer support</div>
									<div className="quality-text">
										You can connect with us on Telegram and get support in case
										you need help or have any questions.
									</div>
								</div>
							</div>
						</div>
					</div>
				</div> */}

        <div className="video-screen">
          <div className="container">
            <div className="content">
              <div className="title">Watch how it works</div>
              <div className="text">
                NFT art creator’s main goal is to invent, and using NFTour
                artists
              </div>
              <Element name="video" className="element"></Element>
              <div className="video">
                <iframe
                  src="https://www.youtube.com/embed/YHatcktJM8I"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/*<Footer></Footer>*/}
      </div>
    </>
  );
}

export default WelcomeNftPage;