/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import HighlightEditing from './../src/highlightediting';
import HighlightCommand from './../src/highlightcommand';

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';

import VirtualTestEditor from '@ckeditor/ckeditor5-core/tests/_utils/virtualtesteditor';
import { getData as getModelData, setData as setModelData } from '@ckeditor/ckeditor5-engine/src/dev-utils/model';

describe( 'HighlightEditing', () => {
	let editor, model;

	beforeEach( () => {
		return VirtualTestEditor
			.create( {
				plugins: [ HighlightEditing, Paragraph ]
			} )
			.then( newEditor => {
				editor = newEditor;

				model = editor.model;
			} );
	} );

	afterEach( () => {
		editor.destroy();
	} );

	it( 'should set proper schema rules', () => {
		expect( editor.model.schema.checkAttribute( [ '$block', '$text' ], 'highlight' ) ).to.be.true;
		expect( editor.model.schema.checkAttribute( [ '$clipboardHolder', '$text' ], 'highlight' ) ).to.be.true;

		expect( editor.model.schema.checkAttribute( [ '$block' ], 'highlight' ) ).to.be.false;
	} );

	it( 'adds highlight command', () => {
		expect( editor.commands.get( 'highlight' ) ).to.be.instanceOf( HighlightCommand );
	} );

	describe( 'data pipeline conversions', () => {
		it( 'should convert defined marker classes', () => {
			const data = '<p>f<mark class="marker">o</mark>o</p>';
			editor.setData( data );

			expect( getModelData( model ) ).to.equal( '<paragraph>[]f<$text highlight="marker">o</$text>o</paragraph>' );
			expect( editor.getData() ).to.equal( data );
		} );

		it( 'should convert only one defined marker classes', () => {
			editor.setData( '<p>f<mark class="marker-green marker">o</mark>o</p>' );

			expect( getModelData( model ) ).to.equal( '<paragraph>[]f<$text highlight="marker">o</$text>o</paragraph>' );
			expect( editor.getData() ).to.equal( '<p>f<mark class="marker">o</mark>o</p>' );
		} );

		it( 'should not convert undefined marker classes', () => {
			editor.setData( '<p>f<mark class="some-unknown-marker">o</mark>o</p>' );

			expect( getModelData( model ) ).to.equal( '<paragraph>[]foo</paragraph>' );
			expect( editor.getData() ).to.equal( '<p>foo</p>' );
		} );

		it( 'should not convert marker without class', () => {
			editor.setData( '<p>f<mark>o</mark>o</p>' );

			expect( getModelData( model ) ).to.equal( '<paragraph>[]foo</paragraph>' );
			expect( editor.getData() ).to.equal( '<p>foo</p>' );
		} );
	} );

	describe( 'editing pipeline conversion', () => {
		it( 'should convert mark element with defined class', () => {
			setModelData( model, '<paragraph>f<$text highlight="marker">o</$text>o</paragraph>' );

			expect( editor.getData() ).to.equal( '<p>f<mark class="marker">o</mark>o</p>' );
		} );
	} );

	describe( 'config', () => {
		describe( 'default value', () => {
			it( 'should be set', () => {
				expect( editor.config.get( 'highlight' ) ).to.deep.equal( {
					options: [
						{ model: 'marker', class: 'marker', title: 'Marker', color: '#ffff66', type: 'marker' },
						{ model: 'greenMarker', class: 'marker-green', title: 'Green marker', color: '#66ff00', type: 'marker' },
						{ model: 'pinkMarker', class: 'marker-pink', title: 'Pink marker', color: '#ff6fff', type: 'marker' },
						{ model: 'redPen', class: 'pen-red', title: 'Red pen', color: '#ff2929', type: 'pen' },
						{ model: 'bluePen', class: 'pen-blue', title: 'Blue pen', color: '#0091ff', type: 'pen' }
					]
				} );
			} );
		} );
	} );
} );
