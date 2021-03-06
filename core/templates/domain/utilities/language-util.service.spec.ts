// Copyright 2017 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Unit tests for LanguageUtilService
 */

import { TestBed } from '@angular/core/testing';

import { LanguageUtilService } from 'domain/utilities/language-util.service';

const CONSTANTS = require('constants.ts');

describe('Language util service', function() {
  var lus = null;
  var mockAutogeneratedAudioLanguages = null;
  var SUPPORTED_CONTENT_LANGUAGES = CONSTANTS.SUPPORTED_CONTENT_LANGUAGES;
  var AUTOGENERATED_AUDIO_LANGUAGES = CONSTANTS.AUTOGENERATED_AUDIO_LANGUAGES;
  var SUPPORTED_AUDIO_LANGUAGES = CONSTANTS.SUPPORTED_AUDIO_LANGUAGES;

  beforeEach(() => {
    var mockSupportedContentLanguages = [{
      code: 'en',
      description: 'English'
    }, {
      code: 'ar',
      description: 'العربية (Arabic)'
    }, {
      code: 'bg',
      description: 'български (Bulgarian)'
    }];
    mockAutogeneratedAudioLanguages = [{
      id: 'en-auto',
      description: 'English (auto)',
      explorationLanguage: 'en',
      speechSynthesisCode: 'en-GB',
      speechSynthesisCodeMobile: 'en_US'
    }];
    var mockSupportedAudioLanguages = [{
      id: 'en',
      description: 'English',
      relatedLanguages: ['en']
    }, {
      id: 'hi-en',
      description: 'Hinglish',
      relatedLanguages: ['hi', 'en']
    }, {
      id: 'es',
      description: 'Spanish',
      relatedLanguages: ['es']
    }];

    CONSTANTS.SUPPORTED_CONTENT_LANGUAGES = mockSupportedContentLanguages;
    CONSTANTS.AUTOGENERATED_AUDIO_LANGUAGES = mockAutogeneratedAudioLanguages;
    CONSTANTS.SUPPORTED_AUDIO_LANGUAGES = mockSupportedAudioLanguages;
  });


  beforeEach(() => {
    lus = TestBed.get(LanguageUtilService);
  });

  afterEach(() =>{
    CONSTANTS.SUPPORTED_CONTENT_LANGUAGES = SUPPORTED_CONTENT_LANGUAGES;
    CONSTANTS.AUTOGENERATED_AUDIO_LANGUAGES = AUTOGENERATED_AUDIO_LANGUAGES;
    CONSTANTS.SUPPORTED_AUDIO_LANGUAGES = SUPPORTED_AUDIO_LANGUAGES;
  });

  it('should get the correct language count', () => {
    expect(lus.getAudioLanguagesCount()).toEqual(3);
  });

  it('should get the correct description given an audio language code',
    () => {
      expect(lus.getAudioLanguageDescription('en')).toEqual('English');
      expect(lus.getAudioLanguageDescription('hi-en')).toEqual('Hinglish');
      expect(lus.getAudioLanguageDescription('es')).toEqual('Spanish');
    }
  );

  it('should correctly compute the complement languages', () => {
    expect(lus.getComplementAudioLanguageCodes([]))
      .toEqual(['en', 'hi-en', 'es']);
    expect(lus.getComplementAudioLanguageCodes(['en']))
      .toEqual(['hi-en', 'es']);
    expect(lus.getComplementAudioLanguageCodes(['hi-en']))
      .toEqual(['en', 'es']);
    expect(lus.getComplementAudioLanguageCodes(['hi-en', 'en']))
      .toEqual(['es']);
    expect(lus.getComplementAudioLanguageCodes(['abcdefg'])).toEqual([
      'en', 'hi-en', 'es']);
  });

  it('should correctly get related language code given audio language code',
    () => {
      expect(lus.getLanguageCodesRelatedToAudioLanguageCode('en')).
        toEqual(['en']);
      expect(lus.getLanguageCodesRelatedToAudioLanguageCode('hi-en')).
        toEqual(['hi', 'en']);
      expect(lus.getLanguageCodesRelatedToAudioLanguageCode('es')).
        toEqual(['es']);
    });

  it('should correctly check if language supports autogenerated audio', () => {
    // We mock the speech synthesis API because its return value is
    // environment-dependent. (It also seems to be somewhat flaky: see
    // https://stackoverflow.com/questions/21513706/ and
    // https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis ).
    //
    // Note: The type of the return value here is wrong: it should be a
    // SpeechSynthesisVoice, not a dict. But it doesn't look like it's possible
    // to construct a SpeechSynthesisVoice manually.
    spyOn(window.speechSynthesis, 'getVoices').and.returnValue([{
      // The quotation marks are needed because "default" is a reserved keyword
      // in JavaScript.
      'default': false,
      lang: 'en-GB',
      localService: false,
      name: 'UK English',
      voiceURI: 'UK English'
    }]);
    expect(window.speechSynthesis.getVoices().length).toEqual(1);
    expect(lus.supportsAutogeneratedAudio('hi')).toEqual(false);
    expect(lus.supportsAutogeneratedAudio('en')).toEqual(true);
  });

  it('should correctly check if audio language is autogenerated', () => {
    expect(lus.isAutogeneratedAudioLanguage('en')).toEqual(false);
    expect(lus.isAutogeneratedAudioLanguage('en-auto')).toEqual(true);
  });

  it('should get correct autogenerated audio language with given code',
    () => {
      expect(Object.values(lus.getAutogeneratedAudioLanguage('en'))).toEqual(
        Object.values(mockAutogeneratedAudioLanguages[0]));
    });

  it('should correctly get all languge ids and text', () => {
    expect(lus.getLanguageIdsAndTexts()).toEqual([{
      id: 'en',
      text: 'English'
    }, {
      id: 'ar',
      text: 'العربية'
    }, {
      id: 'bg',
      text: 'български'
    }]);
  });
});
