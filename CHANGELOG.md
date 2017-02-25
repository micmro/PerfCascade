# Changelog



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
