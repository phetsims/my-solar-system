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
import mySolarSystemStrings from '../../mySolarSystemStrings.js';
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
 
 const SPACING = 10;
 
 type SelfOptions = EmptySelfOptions;
 
 type KeplersLawsOrbitalInformationOptions = SelfOptions & VBoxOptions;
 
 class KeplersLawsOrbitalInformation extends VBox {
 
   public constructor( model: KeplersLawsModel, providedOptions?: KeplersLawsOrbitalInformationOptions ) {

     //  const axisIconImageNode = new Image( ???, { scale: 0.25 } ); TODO

     const secondLawChildren = [
       new Checkbox( model.axisVisibleProperty, new HBox( {
         spacing: 10,
         children: [
           new Text( mySolarSystemStrings.axis, TEXT_OPTIONS )
           //  axisIconImageNode
         ]
       } ), CHECKBOX_OPTIONS ),
       new Checkbox( model.apoapsisVisibleProperty, new HBox( {
         spacing: 10,
         children: [
           new Text( mySolarSystemStrings.apoapsis, TEXT_OPTIONS ),
           new XNode( {
             fill: 'cyan',
             stroke: 'white',
             center: Vector2.ZERO,
             scale: 0.5
           } )
         ]
       } ), CHECKBOX_OPTIONS ),
       new Checkbox( model.periapsisVisibleProperty, new HBox( {
         spacing: 10,
         children: [
           new Text( mySolarSystemStrings.periapsis, TEXT_OPTIONS ),
           new XNode( {
             fill: 'gold',
             stroke: 'white',
             center: Vector2.ZERO,
             scale: 0.5
           } )
         ]
       } ), CHECKBOX_OPTIONS )
     ];

     const thirdLawChildren = [
       new Checkbox( model.semimajorAxisVisibleProperty, new HBox( {
         spacing: 10,
         children: [
           new Text( mySolarSystemStrings.graph.a, TEXT_OPTIONS )
           //  axisIconImageNode
         ]
       } ), CHECKBOX_OPTIONS ),
       new Checkbox( model.periodVisibleProperty, new HBox( {
         spacing: 10,
         children: [
           new Text( mySolarSystemStrings.graph.t, TEXT_OPTIONS )
           //  axisIconImageNode
         ]
       } ), CHECKBOX_OPTIONS )
     ];

     const orbitalInformationNode = new HBox( {
           spacing: 10,
           children: [
             new Text( mySolarSystemStrings.orbital, TITLE_OPTIONS ),
             new InfoButton( { scale: 0.5 } )
           ]
         } );

     const children = [
       orbitalInformationNode,
       ...( model.selectedLawProperty.value === LawMode.SECOND_LAW ? secondLawChildren : thirdLawChildren )
     ];
 
     // increase the touch area of the checkboxes
     const touchAreaHeight = 32;
     children.forEach( child => {
       const KeplersLawsOrbitalInformation = child;
       const bounds = KeplersLawsOrbitalInformation.parentToLocalBounds( KeplersLawsOrbitalInformation.bounds );
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