// Copyright 2022, University of Colorado Boulder


/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { Shape } from '../../../../kite/js/imports.js';
import { HBox, HBoxOptions, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import XNode from '../../../../scenery-phet/js/XNode.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import LawMode from '../model/LawMode.js';

// constants
const CHECKBOX_OPTIONS = {
  boxWidth: 14,
  checkboxColor: MySolarSystemColors.foregroundProperty,
  checkboxColorBackground: MySolarSystemColors.backgroundProperty
};
const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT,
  fill: MySolarSystemColors.foregroundProperty
};

const TITLE_OPTIONS = {
  font: MySolarSystemConstants.TITLE_FONT,
  fill: MySolarSystemColors.foregroundProperty
};
//REVIEW: fix the indentation starting here!
 
 const SPACING = 10;
 
 type SelfOptions = EmptySelfOptions;

 //REVIEW: export!
 type KeplersLawsOrbitalInformationOptions = SelfOptions & VBoxOptions;

 //REVIEW: similarly to OrbitalInformation, I'd recommend a rename to make this sound more like a view
 class KeplersLawsOrbitalInformation extends VBox {
 
   public constructor( model: KeplersLawsModel, providedOptions?: KeplersLawsOrbitalInformationOptions ) {

     //  const axisIconImageNode = new Image( ???, { scale: 0.25 } ); TODO

     const secondLawChildren = [
       new Checkbox( model.axisVisibleProperty, new HBox( {
         spacing: 10,
         children: [
           new Text( MySolarSystemStrings.axisStringProperty, TEXT_OPTIONS )
           //  axisIconImageNode
         ]
       } ), CHECKBOX_OPTIONS ),
       new Checkbox( model.apoapsisVisibleProperty, new HBox( {
         spacing: 10,
         children: [
           new Text( MySolarSystemStrings.apoapsisStringProperty, TEXT_OPTIONS ),
           new XNode( {
             fill: 'cyan',
             stroke: 'white',
             center: Vector2.ZERO, //REVIEW: positioning something in an HBox doesn't do much, it will be overwritten
             scale: 0.5
           } )
         ]
       } ), CHECKBOX_OPTIONS ),
       new Checkbox( model.periapsisVisibleProperty, new HBox( {
         spacing: 10,
         children: [
           new Text( MySolarSystemStrings.periapsisStringProperty, TEXT_OPTIONS ),
           new XNode( {
             fill: 'gold',
             stroke: 'white',
             center: Vector2.ZERO, //REVIEW: positioning something in an HBox doesn't do much, it will be overwritten
             scale: 0.5
           } )
         ]
       } ), CHECKBOX_OPTIONS )
     ];

     //REVIEW: lots of spacing: 10, can we factor this out?

     const thirdLawChildren = [
       new Checkbox( model.semimajorAxisVisibleProperty, new HBox( {
         spacing: 10,
         children: [
           new Text( MySolarSystemStrings.graph.aStringProperty, TEXT_OPTIONS )
           //  axisIconImageNode
         ]
       } ), CHECKBOX_OPTIONS ),
       new Checkbox( model.periodVisibleProperty, new HBox( {
         spacing: 10,
         children: [
           new Text( MySolarSystemStrings.graph.tStringProperty, TEXT_OPTIONS )
           //  axisIconImageNode
         ]
       } ), CHECKBOX_OPTIONS )
     ];

     const orbitalInformationNode = new HBox( {
           spacing: 10,
           children: [
             new Text( MySolarSystemStrings.orbitalStringProperty, TITLE_OPTIONS ),
             new InfoButton( { scale: 0.5 } )
           ]
         } );

     //REVIEW: We link below and overwrite this value, so why specify it here? Can we remove this setting of initial children?
     const children = [
       orbitalInformationNode,
       ...( model.selectedLawProperty.value === LawMode.SECOND_LAW ? secondLawChildren : thirdLawChildren )
     ];
 
     // increase the touch area of the checkboxes
     const touchAreaHeight = 32;
     children.forEach( child => {
       //REVIEW: all of the touch area increases... Seem bad and likely to get overwritten
       //REVIEW: use touchAreaXDilation/mouseAreaXDilation/etc. Also see comments below for "incremental" improvements
       //REVIEW: (that can probably be discarded)

       //REVIEW: camel-case the name of the variable, it doesn't represent a type
       const KeplersLawsOrbitalInformation = child;
       //REVIEW: Don't do this coordinate transform, just access `.localBounds` to get the bounds in a local coordinate frame
       const bounds = KeplersLawsOrbitalInformation.parentToLocalBounds( KeplersLawsOrbitalInformation.bounds );
       //REVIEW: Also, this doesn't update with dynamic layout. We'll need to listen to the bounds of it
       KeplersLawsOrbitalInformation.touchArea = Shape.rectangle( -5, bounds.centerY - touchAreaHeight / 2, bounds.width + 10, touchAreaHeight );
     } );
 
     super( optionize<KeplersLawsOrbitalInformationOptions, SelfOptions, HBoxOptions>()( {
       children: children,
       spacing: SPACING,
       align: 'left',
       stretch: true
     }, providedOptions ) );

     model.selectedLawProperty.link( law => {
       this.children = [
         orbitalInformationNode,
         ...( law === LawMode.SECOND_LAW ? secondLawChildren : thirdLawChildren )
       ];
     } );
   }
 }
 
 mySolarSystem.register( 'KeplersLawsOrbitalInformation', KeplersLawsOrbitalInformation );
 export default KeplersLawsOrbitalInformation;