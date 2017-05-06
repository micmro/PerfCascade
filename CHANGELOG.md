# Changelog



<a name="v2.0.0"></a>
# v2.0.0 (2017-05-06)

* #188 additional cleanup ([bdb9510](https://github.com/micmro/PerfCascade/commit/bdb9510))
* #188 basic outer tabing working ([5b643bf](https://github.com/micmro/PerfCascade/commit/5b643bf))
* #188 fix cross browser tabing ([3669cb7](https://github.com/micmro/PerfCascade/commit/3669cb7))
* #188 fix re-render bg bug ([2bf411e](https://github.com/micmro/PerfCascade/commit/2bf411e))
* #188 fix tooltip length and perf improvement ([5722be5](https://github.com/micmro/PerfCascade/commit/5722be5))
* #188 remove re-query of rows and fix type ([2871a43](https://github.com/micmro/PerfCascade/commit/2871a43))
* add find parentByClass helper ([76488e2](https://github.com/micmro/PerfCascade/commit/76488e2))
* cleanup ([87d7e70](https://github.com/micmro/PerfCascade/commit/87d7e70))
* fix linting-issues found by nes version of tslint ([35ee261](https://github.com/micmro/PerfCascade/commit/35ee261))
* implify class typing ([79c1ae3](https://github.com/micmro/PerfCascade/commit/79c1ae3))
* optimize SVGs and imporve perf ([7c635a5](https://github.com/micmro/PerfCascade/commit/7c635a5))
* reorder row structure, tab mostly working ([2567cc5](https://github.com/micmro/PerfCascade/commit/2567cc5))
* reset shadow value for getNodeTextWidth ([277468e](https://github.com/micmro/PerfCascade/commit/277468e))
* simplify OverlayChangeEvent and generalize forEachNodeList ([caf8f25](https://github.com/micmro/PerfCascade/commit/caf8f25))
* Updated dependencies ([b022923](https://github.com/micmro/PerfCascade/commit/b022923))



<a name="v1.4.0"></a>
# v1.4.0 (2017-04-06)

* Include marks when calculating largest time for the waterfall graph ([49ae356](https://github.com/micmro/PerfCascade/commit/49ae356))



<a name="v1.3.0"></a>
# v1.3.0 (2017-04-02)

* #153 clean rendered data ([5274a3c](https://github.com/micmro/PerfCascade/commit/5274a3c))
* add npm badges ([dd58711](https://github.com/micmro/PerfCascade/commit/dd58711))
* fix link ([111ddba](https://github.com/micmro/PerfCascade/commit/111ddba))



<a name="v1.2.2"></a>
## v1.2.2 (2017-03-26)

* #153 XSS safty improvements ([0a98ffb](https://github.com/micmro/PerfCascade/commit/0a98ffb))
* #156 add fallback for older browser ([1d8f487](https://github.com/micmro/PerfCascade/commit/1d8f487))
* #156 allow headers in overlay to occure multiple times. ([5630516](https://github.com/micmro/PerfCascade/commit/5630516))



<a name="v1.2.1"></a>
## v1.2.1 (2017-03-25)

* #167 fix marker lable in Safari and IE ([76c6248](https://github.com/micmro/PerfCascade/commit/76c6248))
* #190 fix IE overlay (replace css transforms) ([522df99](https://github.com/micmro/PerfCascade/commit/522df99))



<a name="v1.2.0"></a>
# v1.2.0 (2017-03-25)

* #185 add overlay opening animation ([923ea83](https://github.com/micmro/PerfCascade/commit/923ea83))
* Fix docs to reflect focus on HAR ([24d41f8](https://github.com/micmro/PerfCascade/commit/24d41f8))
* fix fetch polyfill for dev-page ([b6a896c](https://github.com/micmro/PerfCascade/commit/b6a896c))



<a name="v1.1.0"></a>
# v1.1.0 (2017-03-24)

* #184 add duration time to mark-name ([f0241a3](https://github.com/micmro/PerfCascade/commit/f0241a3))
* #184 add Marker click toggle ([a81b0fa](https://github.com/micmro/PerfCascade/commit/a81b0fa))
* #184 add option to render userTiming Marker and durations ([e2ff9fc](https://github.com/micmro/PerfCascade/commit/e2ff9fc))
* #184 handel overlay changes ([fdf8c93](https://github.com/micmro/PerfCascade/commit/fdf8c93))
* #184 impove docs and exported types ([057e0c9](https://github.com/micmro/PerfCascade/commit/057e0c9))
* #184 improve selection logic ([0dc24d8](https://github.com/micmro/PerfCascade/commit/0dc24d8))
* #184 ui fixes ([47a5669](https://github.com/micmro/PerfCascade/commit/47a5669))
* #184 update readme with new options ([94b2302](https://github.com/micmro/PerfCascade/commit/94b2302))
* fix linting ([440ae8f](https://github.com/micmro/PerfCascade/commit/440ae8f))
* mark breaking changes ([b0f7114](https://github.com/micmro/PerfCascade/commit/b0f7114))



<a name="v1.0.0"></a>
# v1.0.0 (2017-03-16)

Breaking changes in public api:
* #128 export har typings via `harFormat` namespace ([e70a236](https://github.com/micmro/PerfCascade/commit/e70a236))
* #128 reduce exported types and use @types/har-format ([489ac54](https://github.com/micmro/PerfCascade/commit/489ac54))
* #128 remove `fromPerfCascadeFormat` and add onParsed callback ([4b4aa44](https://github.com/micmro/PerfCascade/commit/4b4aa44))
* #180 remove console logs ([50d4ef5](https://github.com/micmro/PerfCascade/commit/50d4ef5))
* #182 add style field to package.json ([803ca88](https://github.com/micmro/PerfCascade/commit/803ca88))
* add line break ([d849773](https://github.com/micmro/PerfCascade/commit/d849773))
* make unzip-progress status available as callback ([f6cf5f7](https://github.com/micmro/PerfCascade/commit/f6cf5f7))



<a name="v0.9.1"></a>
## v0.9.1 (2017-03-10)

* #177 handle unresolved redirect chains (#179) ([64f0399](https://github.com/micmro/PerfCascade/commit/64f0399)), closes [#179](https://github.com/micmro/PerfCascade/issues/179)
* attach the HAR ([a9c452f](https://github.com/micmro/PerfCascade/commit/a9c452f))
* first version ([9268f1a](https://github.com/micmro/PerfCascade/commit/9268f1a))
* fix build for new node typings ([a4c1a78](https://github.com/micmro/PerfCascade/commit/a4c1a78))



<a name="v0.9.0"></a>
# v0.9.0 (2017-03-08)

* #166 don't rely on fist entry being the first ([c7c8402](https://github.com/micmro/PerfCascade/commit/c7c8402))
* #172 round block lable ([10406a4](https://github.com/micmro/PerfCascade/commit/10406a4))
* #172 round entry data during conversion ([bced49c](https://github.com/micmro/PerfCascade/commit/bced49c))
* #173 fix gzip to zip ([d1c0ec5](https://github.com/micmro/PerfCascade/commit/d1c0ec5))
* #175 fix dubmicated time in mark ([eaf4927](https://github.com/micmro/PerfCascade/commit/eaf4927))
* #175 remove time marker from mark css class ([1eabb34](https://github.com/micmro/PerfCascade/commit/1eabb34))



<a name="v0.8.1"></a>
## v0.8.1 (2017-03-04)

* #160 fix rounding issue with some hars ([324f80a](https://github.com/micmro/PerfCascade/commit/324f80a))



<a name="v0.8.0"></a>
# v0.8.0 (2017-03-02)

* #160 set timescale marker distance dynamically ([92b61e5](https://github.com/micmro/PerfCascade/commit/92b61e5))



<a name="v0.7.0"></a>
# v0.7.0 (2017-03-01)

* #166 filter out inline data ([67036ad](https://github.com/micmro/PerfCascade/commit/67036ad))
* #168 add option to choose first rendered page ([8f89997](https://github.com/micmro/PerfCascade/commit/8f89997))
* update dev-examples to include more options ([5d39bd6](https://github.com/micmro/PerfCascade/commit/5d39bd6))



<a name="v0.6.3"></a>
## v0.6.3 (2017-02-26)

* #155 generalize helpers ([c4097c3](https://github.com/micmro/PerfCascade/commit/c4097c3))
* #162 add more test sample HARs ([41df3ce](https://github.com/micmro/PerfCascade/commit/41df3ce))
* #162 handle HARs with no page property ([ed6b142](https://github.com/micmro/PerfCascade/commit/ed6b142))
* Bytes as MB formatting were off by a factor 1024! ([4ed8a52](https://github.com/micmro/PerfCascade/commit/4ed8a52))
* improve HAR type docs ([11200f0](https://github.com/micmro/PerfCascade/commit/11200f0))



<a name="v0.6.2"></a>
## v0.6.2 (2017-02-25)

* # fix TS 2.2 change that broke travis ([1ecd5bd](https://github.com/micmro/PerfCascade/commit/1ecd5bd))
* #155 refactor to remove rawRessource ([faa269d](https://github.com/micmro/PerfCascade/commit/faa269d))
* build: remove console logs ([612e940](https://github.com/micmro/PerfCascade/commit/612e940))



<a name="v0.6.1"></a>
## v0.6.1 (2017-02-22)

* #155 handle non-string arguments ([5f158c9](https://github.com/micmro/PerfCascade/commit/5f158c9))



<a name="v0.6.0"></a>
# v0.6.0 (2017-02-21)

* #155 move tabs creation to parse-time. (#157) ([6c294c3](https://github.com/micmro/PerfCascade/commit/6c294c3))



<a name="v0.5.1"></a>
## v0.5.1 (2017-02-19)

* #149 escape html characters of raw-content (#152) ([94fa52b](https://github.com/micmro/PerfCascade/commit/94fa52b))



<a name="v0.5.0"></a>
# v0.5.0 (2017-02-18)

* #142 UI/UX tweaks (#148) ([47c2d13](https://github.com/micmro/PerfCascade/commit/47c2d13))
* #142 update icon character ([c13951e](https://github.com/micmro/PerfCascade/commit/c13951e))
* fix image size ([370d932](https://github.com/micmro/PerfCascade/commit/370d932))
* update sample screenshot ([0d82f45](https://github.com/micmro/PerfCascade/commit/0d82f45))



<a name="v0.4.0"></a>
# v0.4.0 (2017-02-13)

* #145 Add warnings and infos to general Tab and #129 show only the highest pritority icon ([08f2cd2](https://github.com/micmro/PerfCascade/commit/08f2cd2))
* #146 Don’t format small sizes as kB. ([4ba02a9](https://github.com/micmro/PerfCascade/commit/4ba02a9))
* #87 add new (unmodified) HARs to dev preview ([bfceec4](https://github.com/micmro/PerfCascade/commit/bfceec4))
* #87 add new sample HAR files ([7d4c8ed](https://github.com/micmro/PerfCascade/commit/7d4c8ed))
* #87 update example ([c1d9cef](https://github.com/micmro/PerfCascade/commit/c1d9cef))
* Don’t warn about missing MIME for 204 responses. ([0a5eb99](https://github.com/micmro/PerfCascade/commit/0a5eb99))
* ensure travis runs lint task ([41ad42f](https://github.com/micmro/PerfCascade/commit/41ad42f))
* Show long cache values as days/hours/minutes. (#144) ([606eb0e](https://github.com/micmro/PerfCascade/commit/606eb0e))



<a name="v0.3.9"></a>
## v0.3.9 (2017-02-10)

* #29 maintain the open tab while open or closing other overlays ([fc803e6](https://github.com/micmro/PerfCascade/commit/fc803e6))
* lint fix ([ffe6235](https://github.com/micmro/PerfCascade/commit/ffe6235))



<a name="v0.3.8"></a>
## v0.3.8 (2017-02-10)

* Don’t hide timings with value 0. ([b37735a](https://github.com/micmro/PerfCascade/commit/b37735a))
* Extract parse and format helpers to separate file ([da80c7a](https://github.com/micmro/PerfCascade/commit/da80c7a))
* Fix incorrect time formatting for first request. ([0e1b97a](https://github.com/micmro/PerfCascade/commit/0e1b97a))
* Fix inverted filter for empty overlay details. ([edc5790](https://github.com/micmro/PerfCascade/commit/edc5790))
* Hide Content Size if it’s same as Content-Length. ([1a3c082](https://github.com/micmro/PerfCascade/commit/1a3c082))
* Hide content.size from response if it’s -1. ([69f9556](https://github.com/micmro/PerfCascade/commit/69f9556))
* Hide empty Redirect URL and Comment properties. ([7262da6](https://github.com/micmro/PerfCascade/commit/7262da6))
* Parse date headers using new parse helpers. ([770f9da](https://github.com/micmro/PerfCascade/commit/770f9da))
* Parse function for positive numbers and formatter for bytes. ([75b75da](https://github.com/micmro/PerfCascade/commit/75b75da))
* Refactor parsing of WPT HAR entry extensions. ([fd06cd3](https://github.com/micmro/PerfCascade/commit/fd06cd3))
* Represent missing date headers as undefined. ([66ac350](https://github.com/micmro/PerfCascade/commit/66ac350))
* Round milliseconds to at most 3 decimals. ([75587cc](https://github.com/micmro/PerfCascade/commit/75587cc))



<a name="v0.3.7"></a>
## v0.3.7 (2017-02-07)

* #88 allow to close details-view by clicking on bar (#140) ([a26f609](https://github.com/micmro/PerfCascade/commit/a26f609)), closes [#140](https://github.com/micmro/PerfCascade/issues/140)
* fix dev-staging path ([36d2d2d](https://github.com/micmro/PerfCascade/commit/36d2d2d))
* tooling: add seperate file-reader watch ([6abc417](https://github.com/micmro/PerfCascade/commit/6abc417))



<a name="v0.3.6"></a>
## v0.3.6 (2017-02-05)

* #137 reverse changelog ([8a97f5d](https://github.com/micmro/PerfCascade/commit/8a97f5d))
* #137 Write changelog Newest to oldest ([f94f2f5](https://github.com/micmro/PerfCascade/commit/f94f2f5))



<a name="v0.3.5"></a>
## v0.3.5 (2017-02-05)

* #137 ensure CHANGELOG.md is committed ([645e53f](https://github.com/micmro/PerfCascade/commit/645e53f))
* append missing v0.3.4 changelog ([c794281](https://github.com/micmro/PerfCascade/commit/c794281))



<a name="v0.3.4"></a>
## v0.3.4 (2017-02-05)

* #137 fix release JSON ([e852425](https://github.com/micmro/PerfCascade/commit/e852425))
* v0.3.3 ([db6ff0d](https://github.com/micmro/PerfCascade/commit/db6ff0d))



<a name="v0.3.3"></a>
## v0.3.3 (2017-02-05)

* #137 Fix changelog format and escaping ([c1b10ea](https://github.com/micmro/PerfCascade/commit/c1b10ea))
* #137 automatic changelog creation added ([6ced761](https://github.com/micmro/PerfCascade/commit/6ced761))
* #137 speed up release branch checkout ([522ba06](https://github.com/micmro/PerfCascade/commit/522ba06))
* format fix ([39acd2f](https://github.com/micmro/PerfCascade/commit/39acd2f))
