/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import Highlight from '../src/highlight';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import List from '@ckeditor/ckeditor5-list/src/list';
import Enter from '@ckeditor/ckeditor5-enter/src/enter';
import Delete from '@ckeditor/ckeditor5-typing/src/delete';

import ClassicTestEditor from '@ckeditor/ckeditor5-core/tests/_utils/classictesteditor';
import { getData as getModelData, setData as setModelData } from '@ckeditor/ckeditor5-engine/src/dev-utils/model';

describe( 'Highlight', () => {
	let editor, model, element;

	beforeEach( () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return ClassicTestEditor
			.create( element, {
				plugins: [ Highlight, BlockQuote, Paragraph, Heading, Image, ImageCaption, List, Enter, Delete ]
			} )
			.then( newEditor => {
				editor = newEditor;
				model = editor.model;
			} );
	} );

	afterEach( () => {
		element.remove();

		return editor.destroy();
	} );

	describe( 'compatibility with images', () => {
		it( 'does work inside image caption', () => {
			setModelData( model, '<image src="foo.png"><caption>foo[bar]baz</caption></image>' );

			editor.execute( 'highlight', { value: 'yellowMarker' } );

			expect( getModelData( model ) )
				.to.equal( '<image src="foo.png"><caption>foo[<$text highlight="yellowMarker">bar</$text>]baz</caption></image>' );
		} );

		it( 'does work on selection with image', () => {
			setModelData(
				model,
				'<paragraph>foo[foo</paragraph><image src="foo.png"><caption>abc</caption></image><paragraph>bar]bar</paragraph>'
			);

			editor.execute( 'highlight', { value: 'yellowMarker' } );

			expect( getModelData( model ) ).to.equal(
				'<paragraph>foo[<$text highlight="yellowMarker">foo</$text></paragraph>' +
				'<image src="foo.png"><caption><$text highlight="yellowMarker">abc</$text></caption></image>' +
				'<paragraph><$text highlight="yellowMarker">bar</$text>]bar</paragraph>'
			);
		} );
	} );
} );
