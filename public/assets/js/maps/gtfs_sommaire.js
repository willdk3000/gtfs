/* ------------------------------------------------------------------------------
*
*  # GTFS sommaire

*  Version: 1.0
*  Latest update: 2018-09-06
*
* ---------------------------------------------------------------------------- */

$(function () {

    //*************************************CALLS AJAX*****************************

    //Assignation
        $.ajax({
            type: "POST",
            url: '/api/sommaire/:dates',
            dataType: 'json',
            //data: {
            //    requete:requeteDyn
            //},
            success: function(data) {
                
                jours(data);

            }
        })



    //Voyages
        $.ajax({
            type: "POST",
            url: '/api/sommaire/:voyages',
            dataType: 'json',
            //data: {
            //    requete:requeteDyn
            //},
            success: function(data) {
                voyages(data);
            
            }
        })
    


    //Heures
        $.ajax({
            type: "POST",
            url: '/api/sommaire/:heures',
            dataType: 'json',
            //data: {
            //    requete:requeteDyn
            //},
            success: function(data) {
                heures(data);
            }
        
        })
    

    
    //Distance
        $.ajax({
            type: "POST",
            url: '/api/sommaire/:dist',
            dataType: 'json',
            //data: {
            //    requete:requeteDyn
            //},
            success: function(data) {
                distance(data);
            }
        })

        

    //*************************************FONCTIONS*****************************


    //Fonction pour journées
    function jours(data){
        const json = JSON.parse(JSON.stringify(data.rows[0]));

        var startdate=moment(json.start_date.substr(0,4)+'-'+json.start_date.substr(4,2)+'-'+json.start_date.substr(6,2), "YYYY-MM-DD");
        const enddate=moment(json.start_date.substr(0,4)+'-'+json.end_date.substr(4,2)+'-'+json.end_date.substr(6,2), "YYYY-MM-DD");
        
        //Jours de semaine
        let startdate_sem=startdate;
        let weekdayCounter = 0;  

        while (startdate_sem <= enddate) {
            if (startdate_sem.format('ddd') !== 'Sat' && startdate_sem.format('ddd') !== 'Sun'){
                weekdayCounter++; //add 1 to your counter if its not a weekend day
            }
            startdate_sem = moment(startdate_sem, 'YYYY-MM-DD').add(1, 'days'); //increment by one day
        }

        //Jours de samedi
        let samediCounter = 0;
        let startdate_sam=startdate;  

        while (startdate_sam <= enddate) {
            if (startdate_sam.format('ddd') == 'Sat'){
                samediCounter++; //add 1 to your counter if its not a weekend day
            }
            startdate_sam = moment(startdate_sam, 'YYYY-MM-DD').add(1, 'days'); //increment by one day
        }
        
        //Jours de dimanche
        let dimancheCounter = 0;
        let startdate_dim=startdate;  

        while (startdate_dim <= enddate) {
            if (startdate_dim.format('ddd') == 'Sat'){
                dimancheCounter++; //add 1 to your counter if its not a weekend day
            }
            startdate_dim = moment(startdate_dim, 'YYYY-MM-DD').add(1, 'days'); //increment by one day
        }   

        $(document).ajaxStop(function(){
            $('#joursemaine').animateNumber({ number: weekdayCounter });
            document.getElementById('joursamedi').innerHTML = samediCounter;
            document.getElementById('jourdimanche').innerHTML = dimancheCounter;
        });

        document.getElementById('debut').innerHTML = startdate._i;
        document.getElementById('fin').innerHTML = enddate._i;

    }



    //Fonction pour voyages
    function voyages(data) {
            
        const json = JSON.parse(JSON.stringify(data.rows));
        var voysemaine="";
        var voysamedi="";
        var voydimanche="";

        json.forEach(function(e){
            if (e.service_id=="SE") {
                voysemaine += JSON.parse(e.count);
            } else if (e.service_id=="SA") {
                voysamedi += JSON.parse(e.count).toLocaleString();
            } else if (e.service_id=="DI") {
                voydimanche += JSON.parse(e.count).toLocaleString();
            }
        })
        
        $(document).ajaxStop(function(){
            $('#voysemaine').animateNumber({ number: voysemaine });
            document.getElementById('voysamedi').innerHTML = voysamedi
            document.getElementById('voydimanche').innerHTML = voydimanche
        });
        

    }



    //Fonction pour heures
    function heures(data){
        const json = JSON.parse(JSON.stringify(data.rows));
        var secsemaine="";
        var secsamedi="";
        var secdimanche="";

        json.forEach(function(e){
            if (e.service_id=="SE") {
                secsemaine += JSON.parse(e.hreservice)
            } else if (e.service_id=="SA") {
                secsamedi += JSON.parse(e.hreservice)
            } else if (e.service_id=="DI") {
                secdimanche += JSON.parse(e.hreservice)
            }
        })

        var hresemaine = Math.ceil(secsemaine/60/60);
        var hresamedi = Math.ceil(secsamedi/60/60).toLocaleString();
        var hredimanche = Math.ceil(secdimanche/60/60).toLocaleString();

        $(document).ajaxStop(function(){
            $('#hresemaine').animateNumber({ number: hresemaine });
            document.getElementById('hresamedi').innerHTML = hresamedi;
            document.getElementById('hredimanche').innerHTML = hredimanche;
        });
        
        
    }



    //Fonction pour distance
    function distance(data){
        const json = JSON.parse(JSON.stringify(data.rows));
        var distsemaine="";
        var distsamedi="";
        var distdimanche="";

        json.forEach(function(e){
            if (e.service_id=="SE") {
                distsemaine += JSON.parse(e.distservice)
            } else if (e.service_id=="SA") {
                distsamedi += JSON.parse(e.distservice)
            } else if (e.service_id=="DI") {
                distdimanche += JSON.parse(e.distservice)
            }
        })

        var distsemaine = Math.ceil(distsemaine/1000);
        var distsamedi = Math.ceil(distsamedi/1000).toLocaleString();
        var distdimanche = Math.ceil(distdimanche/1000).toLocaleString();

        
        $(document).ajaxStop(function(){
            $('#distsemaine').animateNumber({ number: distsemaine });
            document.getElementById('distsamedi').innerHTML = distsamedi;
            document.getElementById('distdimanche').innerHTML = distdimanche;
        });
        

    }


})
