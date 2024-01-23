// Copyright 2023, University of Colorado Boulder

/**
 * This source file implements the "client-configurable presets" feature for PhET-iO.
 * A preset is a configuration of an orbital system that is typically immutable, and changing it via the UI
 * causes the selected orbital system to change to 'Custom'.  This feature allows a few specific presets to be
 * modified via PHET-iO (and only via PhET-iO) so that PhET-iO clients can create presets for their products.
 *
 * See https://github.com/phetsims/my-solar-system/issues/233 for requirements, design, and history.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import BodyInfo, { BodyInfoOptions, BodyInfoStateObject } from '../../../../solar-system-common/js/model/BodyInfo.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Property from '../../../../axon/js/Property.js';
import OrbitalSystem from './OrbitalSystem.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import mySolarSystem from '../../mySolarSystem.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';

// The subset of BodyInfo that we want clients to configure
type BodyInfoSubsetOptions = PickRequired<BodyInfoOptions, 'mass' | 'position' | 'velocity'>;

// The subset of BodyInfoStateObject needed to serialize a BodyInfoSubset instance
type BodyInfoSubsetStateObject = PickRequired<BodyInfoStateObject, 'mass' | 'position' | 'velocity'>;

/**
 * BodyInfoSubset is the subset of BodyInfo that PhET-iO clients can configure. An orbital system "preset"
 * is an array of BodyInfo, a full description of the bodies that make up the preset. There are fields in this
 * full description that we do not want the PhET-iO client to see or change: isActive, massRange, tandemName.
 * This class serves to filter out those fields, then add them back when changing a client-configurable preset.
 */
class BodyInfoSubset {

  public readonly mass: number;
  public readonly position: Vector2;
  public readonly velocity: Vector2;

  public constructor( providedOptions: BodyInfoSubsetOptions ) {
    this.mass = providedOptions.mass;
    this.position = providedOptions.position;
    this.velocity = providedOptions.velocity;
  }

  /**
   * Extracts a subset from a BodyInfo, and returns a new BodyInfoSubset.
   */
  public static fromBodyInfo( bodyInfo: BodyInfo ): BodyInfoSubset {
    return new BodyInfoSubset( {
      mass: bodyInfo.mass,
      position: bodyInfo.position,
      velocity: bodyInfo.velocity
    } );
  }

  /**
   * Converts this subset of information to a BodyInfo instance, suitable for reinitializing one of the presets.
   */
  public toBodyInfo(): BodyInfo {
    return new BodyInfo( {
      isActive: true, // all bodies in a preset are active
      mass: this.mass,
      massRange: SolarSystemCommonConstants.DEFAULT_MASS_RANGE, // used for all presets in My Solar System
      position: this.position,
      velocity: this.velocity
      // tandemName is not provided for presets in My Solar System, and default to "body1", etc.
    } );
  }

  /**
   * Deserialization: JSON => BodyInfoSubset
   */
  private static fromStateObject( stateObject: BodyInfoSubsetStateObject ): BodyInfoSubset {
    return new BodyInfoSubset( {
      mass: stateObject.mass,
      position: Vector2.fromStateObject( stateObject.position ),
      velocity: Vector2.fromStateObject( stateObject.velocity )
    } );
  }

  /**
   * BodyInfoSubsetIO implements 'Data type serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   * Data type serialization is appropriate because BodyInfoSubset is a data type for a Property.
   */
  public static readonly BodyInfoSubsetIO = new IOType<BodyInfoSubset, BodyInfoSubsetStateObject>( 'BodyInfoSubsetIO', {
    valueType: BodyInfoSubset,
    stateSchema: {
      mass: NumberIO,
      position: Vector2.Vector2IO,
      velocity: Vector2.Vector2IO
    },
    // toStateObject: The default works fine here.
    fromStateObject: stateObject => BodyInfoSubset.fromStateObject( stateObject )
  } );
}

/**
 * OrbitalSystemInfoProperty is the Property used by a PhET-iO client to customize an orbital system preset.
 * Instances of this Property are created in LabModel. The PHET-iO client typically configures a preset by
 * locating an instance of OrbitalSystemInfoProperty in Studio, pressing the "Get Value" button to get the
 * JSON representation of the value, editing that JSON in Studio, then pressing the "Set Value" button.
 * When the value is set, this class is also responsible for converting the information provided by the PHET-iO
 * client to a full description of a preset, then writing that description to the proper preset in the
 * OrbitalSystems enumeration.
 */
export default class OrbitalSystemInfoProperty extends Property<BodyInfoSubset[]> {

  public constructor( orbitalSystem: OrbitalSystem,
                      orbitalSystemProperty: Property<OrbitalSystem>,
                      maxNumberOfBodies: number,
                      tandem: Tandem ) {

    // Convert the orbitalSystem's full description of a preset to the subset that we want PhET-iO clients to configure.
    const initialValue = orbitalSystem.bodyInfo.map( bodyInfo => BodyInfoSubset.fromBodyInfo( bodyInfo ) );

    super( initialValue, {
      validators: [ {
        isValidValue: bodyInfo => bodyInfo.length >= 1 && bodyInfo.length <= maxNumberOfBodies,
        validationMessage: `Must be between 1 and ${maxNumberOfBodies} bodies`
      } ],
      tandem: tandem,
      phetioValueType: ArrayIO( BodyInfoSubset.BodyInfoSubsetIO ),
      phetioDocumentation: 'Client-configurable preset for Orbital System, available only via PhET-iO',
      phetioFeatured: true
    } );

    this.lazyLink( bodyInfoSubset => {

      // Convert the subset that PhET-iO clients configure back to a full description of the preset.
      orbitalSystem.bodyInfo = bodyInfoSubset.map( bodyInfoSubset => bodyInfoSubset.toBodyInfo() );

      // Force the view to refresh if the system that was changed is the selected system.
      if ( orbitalSystemProperty.value === orbitalSystem ) {
        orbitalSystemProperty.value = OrbitalSystem.CUSTOM;
        orbitalSystemProperty.value = orbitalSystem;
      }
    } );
  }
}

mySolarSystem.register( 'OrbitalSystemInfoProperty', OrbitalSystemInfoProperty );