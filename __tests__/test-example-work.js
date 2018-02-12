import React from 'react';
import { shallow } from 'enzyme';
import ExampleWork, { ExampleWorkBubble } from '../js/example-work';
import ExampleWorkModal from '../js/example-work-modal';

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

  it("Should be a <span> element", () => {
    expect(component.type()).toEqual('span');
  });

  it("Should contain as many children as there are work examples", () => {
    expect(component.find("ExampleWorkBubble").length).toEqual(workExamples.length);
  });

  it("Should allow the modal to open and close", () => {
    component.instance().openModal();
    expect(component.instance().state.modalOpen).toBe(true);
    component.instance().closeModal();
    expect(component.instance().state.modalOpen).toBe(false);
  });

});

describe("ExampleWorkBubble component", () => {
  let mockOpenModalFn = jest.fn();
  let mockCloseModalFn = jest.fn();
  let component = shallow(<ExampleWorkBubble example={workExamples[1]} openModal={ mockOpenModalFn }/>);
  let modalComponent = shallow(<ExampleWorkModal example={workExamples[1]} closeModal={mockCloseModalFn}/>);
  let images = component.find("img");

  it("Should contain a single 'img' element", () => {
    expect(images.length).toEqual(1);
  });

  it("Should have image src set correctly", () => {
    expect(images.getElements()[0].props.src).toEqual(workExamples[1].image.src);
  });

  it("Should call the openModal handler when clicked", () => {
    component.find(".section__exampleWrapper").simulate('click');
    expect(mockOpenModalFn).toHaveBeenCalled();
  });

  it("Should call the closeModal handler when clicked", () => {
    modalComponent.find(".modal__closeButton").simulate('click');
    expect(mockCloseModalFn).toHaveBeenCalled();
  });
});
