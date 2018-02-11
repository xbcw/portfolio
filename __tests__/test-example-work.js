import React from 'react';
import { shallow } from 'enzyme';
import ExampleWork, { ExampleWorkBubble } from '../js/example-work';

const workExamples = [
  {
    'title': "Code Example",
    'image': {
      'desc': "example screenshot of a project involving code",
      'src': "images/example1.png",
      'comment': ``
    }
  },
  {
    'title': "Chemistry Example",
    'image': {
      'desc': "example screenshot of a project involving chemistry",
      'src': "images/example2.png",
      'comment': `“Chemistry” by Surian Soosay is licensed under CC BY 2.0
           https://www.flickr.com/photos/ssoosay/4097410999`
    }
  }
];

describe("ExampleWork component", () => {
  let component = shallow(<ExampleWork work={workExamples}/>);

  it("Should be a <section> element", () => {
    expect(component.type()).toEqual('section');
  });

  it("Should contain as many children as there are work examples", () => {
    expect(component.find("ExampleWorkBubble").length).toEqual(workExamples.length);
  });

});

describe("ExampleWorkBubble component", () => {
  let component = shallow(<ExampleWorkBubble example={workExamples[1]}/>);
  let images = component.find("img");

  it("Should contain a single 'img' element", () => {
    expect(images.length).toEqual(1);
  });

  it("Should have image src set correctly", () => {
    expect(images.getElements()[0].props.src).toEqual(workExamples[1].image.src);
  });
});
