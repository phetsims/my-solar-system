// Copyright 2022, University of Colorado Boulder


/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

 import { Shape } from '../../../../kite/js/imports.js';
 import { FlowBox, Text, VBoxOptions } from '../../../../scenery/js/imports.js';
 import Checkbox from '../../../../sun/js/Checkbox.js';
 import mySolarSystem from '../../mySolarSystem.js';
 import mySolarSystemStrings from '../../mySolarSystemStrings.js';
 import optionize from '../../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../../phet-core/js/types/EmptyObjectType.js';
 import Vector2 from '../../../../dot/js/Vector2.js';
 import XNode from '../../../../scenery-phet/js/XNode.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
 
 const axisString = mySolarSystemStrings.axis;
 const apoapsisString = mySolarSystemStrings.apoapsis;
 const periapsisString = mySolarSystemStrings.periapsis;
 
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
 
 const SPACING = 10;
 
 type SelfOptions = EmptyObjectType;
 
 type KeplersLawsOrbitalInformationOptions = SelfOptions & VBoxOptions;
 
 class KeplersLawsOrbitalInformation extends FlowBox {
 
   constructor( model: KeplersLawsModel, providedOptions?: KeplersLawsOrbitalInformationOptions ) {
 
    //  const axisIconImageNode = new Image( ???, { scale: 0.25 } ); TODO
 
     const children = [
       new Checkbox( model.pathVisibleProperty, new FlowBox( {
         spacing: 10,
         children: [
           new Text( axisString, TEXT_OPTIONS )
           //  axisIconImageNode
         ]
       } ), CHECKBOX_OPTIONS ),
       new Checkbox( model.apoapsisVisibleProperty, new FlowBox( {
         spacing: 10,
         children: [
           new Text( apoapsisString, TEXT_OPTIONS ),
           new XNode( {
             fill: 'cyan',
             stroke: 'white',
             center: Vector2.ZERO,
             scale: 0.5
           } )
         ]
       } ), CHECKBOX_OPTIONS ),
       new Checkbox( model.periapsisVisibleProperty, new FlowBox( {
         spacing: 10,
         children: [
           new Text( periapsisString, TEXT_OPTIONS ),
           new XNode( {
             fill: 'gold',
             stroke: 'white',
             center: Vector2.ZERO,
             scale: 0.5
           } )
         ]
       } ), CHECKBOX_OPTIONS )
     ];
 
     // increase the touch area of the checkboxes
     const touchAreaHeight = 32;
     children.forEach( child => {
       const KeplersLawsOrbitalInformation = child;
       const bounds = KeplersLawsOrbitalInformation.parentToLocalBounds( KeplersLawsOrbitalInformation.bounds );
       KeplersLawsOrbitalInformation.touchArea = Shape.rectangle( -5, bounds.centerY - touchAreaHeight / 2, bounds.width + 10, touchAreaHeight );
     } );
 
     super( optionize<KeplersLawsOrbitalInformationOptions, SelfOptions, FlowBox>()( {
       children: children,
       spacing: SPACING,
       orientation: 'vertical',
       align: 'left',
       stretch: true
     }, providedOptions ) );
   }
 }
 
 mySolarSystem.register( 'KeplersLawsOrbitalInformation', KeplersLawsOrbitalInformation );
 export default KeplersLawsOrbitalInformation;