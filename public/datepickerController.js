import _ from 'lodash';
import dateMath from '@elastic/datemath';
import moment from 'moment';
import { uiModules } from 'ui/modules';
import 'plugins/kibana-datepicker-plugin/datepickerLanguages';

const module = uiModules.get('kibana/kibana-datepicker-plugin', ['kibana']);

module.controller('KbnDatePickerController', function (datepickerPluginLocales, $scope, $rootScope, $timeout, $locale) {

    $scope.format = 'MMMM Do YYYY, HH:mm:ss.SSS';
    var absoluteApplied = false;

    $scope.time = {
        from: moment(),
        to: moment(),
        absolute_from: moment(),
        absolute_to: moment()
    };

    $scope.absolute = {
        from: moment(),
        to: moment()
    };

    $scope.$watch('time.absolute_from', function (date) {
        if (!date) {
            date = new Date();
        }
        console.log(date instanceof Date);
        if (date instanceof Date) {
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            if (_.isDate(date)) $scope.time.absolute_from = moment(date);
            date.setHours(23);
            date.setMinutes(59);
            date.setSeconds(59);
            date.setMilliseconds(999);
            if (_.isDate(date)) $scope.time.absolute_to = moment(date);
        }
    });

    $scope.setToNow = function () {
        $scope.time.absolute_from = moment();
        $scope.time.absolute_to = moment();
    };

    $scope.applyAbsolute = function () {
        $scope.from = moment($scope.absolute.from);
        $scope.to = moment($scope.absolute.to);
        $scope.setAbsolute();
    };

    $scope.setAbsolute = function() {
        absoluteApplied = true;
        if (!$rootScope.$$timefilter) {
            $rootScope.$$timefilter = {};
            $rootScope.$$timefilter.time = $scope.time;
        }
        $rootScope.$$timefilter.time.from = $scope.time.from = $scope.time.absolute_from;
        $rootScope.$$timefilter.time.to = $scope.time.to = $scope.time.absolute_to;
    };

    $rootScope.$watchMulti([
        '$$timefilter.time.from',
        '$$timefilter.time.to'
    ], setTime);

    $scope.addADay = function() {
        $scope.time.absolute_from = moment($scope.time.absolute_from).add(1,'days').toDate();
    }

    $scope.decreaseADay = function() {
        $scope.time.absolute_from = moment($scope.time.absolute_from).subtract(1,'days').toDate();
    }

    function setTime(timeArray) {
        if (absoluteApplied) {
            absoluteApplied = false;
            return;
        }
        // Update our $scope, since time was not updated by this plugin.
        $scope.time = {
            from: timeArray[0],
            to: timeArray[1],
            absolute_from: dateMath.parse(timeArray[0]),
            absolute_to: dateMath.parse(timeArray[1], true)
        }
    }

    $scope.translations = {
        'en-us': {
            'go': 'Go'
            , 'date': 'Date'
            , 'set_to_now': 'Set To Now'
            , 'invalid_date': 'Invalid Date'
            , 'must_occur_before': 'must occur before'
        }, 'pt-br': {
            'go': 'Aplicar'
            , 'date': 'Data'
            , 'set_to_now': 'Mudar Para Agora'
            , 'invalid_date': 'Data Inválida'
            , 'must_occur_before': 'deve ser antes de'
        }
    }

    var locales = datepickerPluginLocales;
    var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};

    // Initialize variables
    $scope.language = $scope.translations['en-us'];
    angular.copy(locales['en-us'], $locale);

    $scope.$watch('vis.params.language', function(newValue, oldValue) {
        $scope.language = $scope.translations[newValue];
        // Update angular $locale to the correct language. This might change things you dont want to!
        angular.copy(locales[newValue], $locale);
        $scope.time.absolute_from = new Date($scope.time.absolute_from);
    });
});
