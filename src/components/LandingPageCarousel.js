import React from 'react';
import {
  Carousel
} from 'react-bootstrap';

export default () => {
  const imageURLOne = 'https://firebasestorage.googleapis.com/v0/b/fitlink-1.appspot.com/o/landingPageImages%2Fimage_one.jpg?alt=media&token=ff1d3b06-db8c-44ef-a725-4f9b08165481';
  const imageURLTwo = 'https://firebasestorage.googleapis.com/v0/b/fitlink-1.appspot.com/o/landingPageImages%2Fimage_two.jpg?alt=media&token=833297c5-36ce-4c60-bfa2-6f0fe8b52284';
  const imageURLThree = 'https://firebasestorage.googleapis.com/v0/b/fitlink-1.appspot.com/o/landingPageImages%2Fimage_three.jpg?alt=media&token=c4a9e1be-5abe-4cbe-8278-3923eae2b79a';

  return (
    <Carousel>
  <Carousel.Item>
    <img
      className="landing-page-image d-block w-100"
      src={imageURLOne}
      alt="First slide"
    />
    <Carousel.Caption>
      <h1>Welcome to FitLink</h1>
      <p>&ensp;</p>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item>
    <img
      className="landing-page-image d-block w-100"
      src={imageURLTwo}
      alt="Third slide"
    />

    <Carousel.Caption>
      <h1>Follow your friends</h1>
      <p>Stay in touch with friends and post workouts together.</p>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item>
    <img
      className="landing-page-image d-block w-100"
      src={imageURLThree}
      alt="Third slide"
    />

    <Carousel.Caption>
      <h1>Get ideas on workouts</h1>
      <p>Search and see what workouts your friends are doing.</p>
    </Carousel.Caption>
  </Carousel.Item>
</Carousel>
  )
}
