// Copyright 2023, University of Colorado Boulder

/**
 * Box that shows the length of distances available in the sim:
 *  - d1 and d2: Focal strings' lengths from the sun and secondary focus to the planet
 *  - R: Distance from the sun to the planet (circular orbit)
 *  - a: Semi-major axis of the ellipse
 *
 * @author Agustín Vallejo
 */

import { HBox, RichText, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import mySolarSystem from '../../mySolarSystem.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import EllipticalOrbitEngine from '../model/EllipticalOrbitEngine.js';
import LineArrowNode from '../../../../scenery-phet/js/LineArrowNode.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';

const DISTANCE_LABEL_OPTIONS = combineOptions<TextOptions>( {
  scale: 1.5,
  stroke: '#ccb285'
}, MySolarSystemConstants.TEXT_OPTIONS );

export default class DistancesDisplayNode extends VBox {
  public orbit: EllipticalOrbitEngine;

  public constructor(
    model: KeplersLawsModel,
    public modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>
  ) {
    super( {
      spacing: 10,
      visibleProperty: model.stringsVisibleProperty
    } );

    this.orbit = model.engine;

    const STRING_ARROW_OPTIONS = {
      stroke: '#ccb285',
      headHeight: 10,
      headWidth: 10,
      headLineWidth: 3,
      tailLineWidth: 3,
      tailLineDash: [ 10, 2 ]
    };

    const MAJOR_AXIS_ARROW_OPTIONS = {
      stroke: 'orange',
      headHeight: 10,
      headWidth: 10,
      headLineWidth: 3,
      tailLineWidth: 3
    };

    const stringLabelNode1 = new RichText( '', DISTANCE_LABEL_OPTIONS );
    const stringLabelNode2 = new RichText( '', DISTANCE_LABEL_OPTIONS );

    const d1lineArrowNode = new LineArrowNode( 0, 0, 0, 1, STRING_ARROW_OPTIONS );
    const d2lineArrowNode = new LineArrowNode( 0, 0, 0, 1, STRING_ARROW_OPTIONS );

    const aLineArrowNode1 = new LineArrowNode( 0, 0, 0, 1, MAJOR_AXIS_ARROW_OPTIONS );
    const aLineArrowNode2 = new LineArrowNode( 0, 0, 0, 1, MAJOR_AXIS_ARROW_OPTIONS );


    const focalStringsBox = new HBox( {
      children: [
        new VBox( {
          children: [
            stringLabelNode1,
            d1lineArrowNode
          ]
        } ),
        new VBox( {
          children: [
            stringLabelNode2,
            d2lineArrowNode
          ]
        } )
      ]
    } );

    const majorAxisBox = new HBox( {
      children: [
        new VBox( {
          children: [
            aLineArrowNode1,
            new RichText( MySolarSystemStrings.semiMajorAxisSymbolStringProperty, DISTANCE_LABEL_OPTIONS )
          ]
        } ),
        new VBox( {
          children: [
            aLineArrowNode2,
            new RichText( MySolarSystemStrings.semiMajorAxisSymbolStringProperty, DISTANCE_LABEL_OPTIONS )
          ]
        } )
      ]
    } );

    this.children = [
      focalStringsBox,
      majorAxisBox
    ];

    const updateDistances = () => {
      const a = this.orbit.a;
      const e = this.orbit.e;
      const c = e * a;
      const scale = this.modelViewTransformProperty.value.modelToViewDeltaX( 1 );

      const bodyPosition = this.orbit.createPolar( -this.orbit.nu );

      const d1Length = bodyPosition.magnitude * scale;
      const d2Length = bodyPosition.plusXY( 2 * c, 0 ).magnitude * scale;

      stringLabelNode1.setString( this.orbit.eccentricityProperty.value === 0 ? 'r' : 'd<sub>1' );
      stringLabelNode2.setString( this.orbit.eccentricityProperty.value === 0 ? 'r' : 'd<sub>2' );

      stringLabelNode1.x = -d2Length / 2;
      stringLabelNode2.x = d1Length / 2;

      d1lineArrowNode.setTailAndTip( 0, 0, d1Length, 0 );
      d2lineArrowNode.setTailAndTip( 0, 0, -d2Length, 0 );

      aLineArrowNode1.setTailAndTip( 0, 0, a * scale, 0 );
      aLineArrowNode2.setTailAndTip( 0, 0, -a * scale, 0 );
    };

    updateDistances();

    this.orbit.changedEmitter.addListener( updateDistances );
  }
}

mySolarSystem.register( 'DistancesDisplayNode', DistancesDisplayNode );