import {omk} from './omk.js';
import { Octokit, App } from "https://esm.sh/octokit";

export class auth {
    constructor(params) {
        var me = this;
        this.modal;
        this.m;
        this.navbar = params.navbar ? params.navbar : 'navbarMain';
        this.apiOmk = params.apiOmk ? params.apiOmk : false; 
        this.mail = params.mail ? params.mail : false;
        this.ident = params.ident ? params.ident : false;
        this.key = params.key ? params.key : false;
        this.omk = false;
        this.keyGitHub = params.keyGitHub ? params.keyGitHub : false;        
        this.octo = params.octo ? params.octo : false;        
        this.userAdmin=false;
        this.user=false;
        this.loginGitHub=false;
        var iconIn='<i class="fas fa-sign-in-alt"></i>', 
            iconOut='<i class="fa-solid fa-right-from-bracket"></i>',
            btnLogin, nameLogin, alertAuth, alertMail, alertServer, alertUnknown, alertGitHub;
                
        this.init = function () {
            //création des éléments html
            let htmlNavBar = `<div class="btn-group">
                    <div class="mt-2">User : <span id="userLogin">Anonymous</span></div>                                        
                    <button id="btnAddUser" style="visibility:hidden;" title="Add user" class="btn btn-outline-danger" ><i class="fa-solid fa-user-plus"></i></button>
                    <button id="btnLogin" title="Connexion" class="btn btn-outline-success" >${iconIn}</button>
                                                                
                </div>`;
            me.navbar.append('li').attr('class',"nav-item ms-2 me-1").html(htmlNavBar);
            let htmlModal = `
                <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                    <h5 class="modal-title">Authentication</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">

                        <div class="input-group mb-3">
                        <span class="input-group-text" id="serverIcon"><i class="fa-solid fa-server"></i></span>
                        <input id="authServer" type="text" class="form-control" placeholder="Server" aria-label="Email" aria-describedby="serverIcon">
                        </div>

                        <div class="input-group mb-3">
                        <span class="input-group-text" id="mailIcon"><i class="fa-solid fa-at"></i></span>
                        <input id="authMail" type="text" class="form-control" placeholder="Email" aria-label="Email" aria-describedby="mailIcon">
                        </div>

                        <div class="input-group mb-3">
                        <span class="input-group-text" id="identIcon"><i class="fa-solid fa-fingerprint"></i></i></span>
                        <input id="authIdent" type="password" class="form-control" placeholder="Identity" aria-describedby="identIcon">
                        </div>
                        

                        <div class="input-group mb-3">
                        <span class="input-group-text" id="mdpIcon"><i class="fa-solid fa-key"></i></span>
                        <input id="authPwd" type="password" class="form-control" placeholder="Key" aria-describedby="mdpIcon">
                        </div>

                        <div class="input-group mb-3">
                        <span class="input-group-text" id="keyGitHub">
                        <i class="fa-brands fa-github"></i>
                        <i style="margin-left:3px;" class="fa-solid fa-key"></i>
                        </span>
                        <input id="authGitHubKey" type="password" class="form-control" placeholder="GitHub Key" aria-describedby="keyGitHub">
                        </div>                        

                        <div class="collapse" id="alertAuth">
                            <div  class="alert alert-danger d-flex align-items-center" role="alert">
                                <i class="fa-solid fa-triangle-exclamation"></i>
                                <div id='errorMessage' class='mx-1'>
                                identity or credential are wrong !
                                </div>
                            </div>
                        </div>

                        <div class="collapse" id="alertMail">
                            <div  class="alert alert-warning d-flex align-items-center" role="alert">
                                <i class="fa-solid fa-triangle-exclamation"></i>
                                <div id='errorMessage' class='mx-1'>
                                The user does not exist !
                                </div>
                            </div>
                        </div>

                        <div class="collapse" id="alertServer">
                            <div  class="alert alert-warning d-flex align-items-center" role="alert">
                                <i class="fa-solid fa-triangle-exclamation"></i>
                                <div id='errorMessage' class='mx-1'>
                                Server does not exist !
                                </div>
                            </div>
                        </div>

                        <div class="collapse" id="alertUnknown">
                            <div  class="alert alert-warning d-flex align-items-center" role="alert">
                                <i class="fa-solid fa-triangle-exclamation"></i>
                                <div id='errorMessage' class='mx-1'>
                                This user is unknown.
                                Please contact the administrator.                                
                                </div>
                            </div>
                        </div>

                        <div class="collapse" id="alertGitHub">
                            <div  class="alert alert-warning d-flex align-items-center" role="alert">
                                <i class="fa-solid fa-triangle-exclamation"></i>
                                <div id='errorMessage' class='mx-1'>
                                This GitHub Key is not correct !.
                                </div>
                            </div>
                        </div>
                        

                    </div>                          
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button id='btnCheck' style="visibility:visible;" type="button" class="btn btn-primary">Check</button>
                    </div>
                </div>
                </div>
            `;
            me.m = d3.select('body').append('div')
                .attr('id','modalAuth').attr('class','modal').attr('tabindex',-1);
            me.m.html(htmlModal);
            me.modal = new bootstrap.Modal('#modalAuth');
            alertAuth = new bootstrap.Collapse('#alertAuth', {toggle: false});
            alertMail = new bootstrap.Collapse('#alertMail', {toggle: false});
            alertServer = new bootstrap.Collapse('#alertServer', {toggle: false});
            alertUnknown = new bootstrap.Collapse('#alertUnknown', {toggle: false});
            alertGitHub = new bootstrap.Collapse('#alertGitHub', {toggle: false});
            alertAuth.hide();
            alertMail.hide();
            alertServer.hide();
            alertUnknown.hide();
            alertGitHub.hide();
            //gestion des événements
            me.m.selectAll("input").on('change',e=>{
                alertAuth.hide();
                alertMail.hide();                    
                alertServer.hide();
                alertUnknown.hide();
                alertGitHub.hide();                    
                me.mail="";
                me.ident="";
                me.key="";
                me.apiOmk="";
                me.user=false;
                me.keyGitHub="";                    
            });                                                                                    
            nameLogin = me.navbar.select("#userLogin");
            btnLogin = me.navbar.select("#btnLogin");
            btnLogin.on('click',e=>{
                if(btnLogin.attr('class')=='btn btn-outline-success')me.modal.show();
                else{
                    me.mail="";
                    me.ident="";
                    me.key="";
                    me.apiOmk="";
                    me.user=false;
                    me.keyGitHub="";                    
                    nameLogin.html('Anonymous');
                    btnLogin.attr('class','btn btn-outline-success');
                }
            });                                                                                    
            me.m.select("#btnCheck").on('click',e=>{
                me.getUser(null);
            });                                                                                    
        }
        async function getGitHubAuth(){
            // Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
            const {
                data: { login },
            } = await me.octo.rest.users.getAuthenticated();
            me.loginGitHub = login;
        }
        this.getUser = function (cb){

            //vérifie la connexion à OMK
            me.apiOmk = me.apiOmk ? me.apiOmk : me.m.select("#authServer").node().value;
            if(me.apiOmk) me.apiOmk += me.apiOmk.slice(-1)=='/' ? "" : "/";
            me.mail = me.mail ? me.mail : me.m.select("#authMail").node().value;
            me.ident = me.ident ? me.ident : me.m.select("#authIdent").node().value;
            me.key = me.key ? me.key : me.m.select("#authPwd").node().value;
            if(!me.mail || !me.ident || !me.key || !me.apiOmk){
                if(cb)cb(me.user);
            }else{
                me.omk = new omk({'api':me.apiOmk,'key':me.key,'ident':me.ident,'mail':me.mail});
                me.omk.getUser(u=>{
                    if(!u){
                        alertMail.show();
                        me.user = false;
                        me.omk = false;                                                                     
                    }else {
                        me.user = u;
                        me.userAdmin = me.user["o:role"] == 'global_admin';            
                        nameLogin.html(me.user['o:name']);
                        btnLogin.attr('class','btn btn-danger').html(iconOut);                        
                        me.user.id=me.user['o:id'];
                        me.modal.hide();
                    }
                    authGitHub(uGitHub=>{
                        me.user.loginGitHub=uGitHub;
                        if(cb)cb(me.user);
                    })
                })    
            };
        }

        function authGitHub(cb){
            //vérifie la connexion à GitHub             
            me.keyGitHub = me.keyGitHub ? me.keyGitHub : me.m.select("#authGitHubKey").node().value;
            if(me.keyGitHub){
                // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
                me.octo = new Octokit({ auth: me.keyGitHub});
                getGitHubAuth().then(e=>{
                    cb(me.loginGitHub);
                })
                .catch(err => {
                    alertGitHub.show();
                    me.octo = false;
                    me.loginGitHub = false,
                    console.error(err);
                    cb(me.loginGitHub);
                });
            }else{
                alertGitHub.show();
                cb(me.loginGitHub);
            }
        }
        this.init();
    }
}
