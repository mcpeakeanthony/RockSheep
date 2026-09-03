/**
 * Created by anthonymcpeake on 03/04/2017.
 */
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = app || {};


app.GoogleAnalytics = {

    trackerID: 'UA-96599034-1',

    // Application Constructor
    initialize: function () {
        window.ga.startTrackerWithId(this.trackerID, 30).then(
            function () {
                console.log('Google analytics is ready now');
            },
            function () {
                console.log('Problem loading analytics');
            }
        ).catch(function (e) {
            console.log('Error starting GoogleAnalytics', e)
        });
    },
};

app.GoogleAnalytics.initialize();
