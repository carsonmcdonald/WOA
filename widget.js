/**
 * Copyright (c) 2010 Carson McDonald
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy  * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var baseSiteInfo = {
  so: {
    siteName: 'Stack Overflow',
    siteUrl: 'http://stackoverflow.com',
    siteApi: 'http://api.stackoverflow.com',
    siteIcon: 'http://sstatic.net/so/favicon.ico'
  },
  mso: {
    siteName: 'Meta Stack Overflow',
    siteUrl: 'http://meta.stackoverflow.com',
    siteApi: 'http://api.meta.stackoverflow.com',
    siteIcon: 'http://sstatic.net/mso/favicon.ico'
  },
  sf: {
    siteName: 'Server Fault',
    siteUrl: 'http://serverfault.com',
    siteApi: 'http://api.serverfault.com',
    siteIcon: 'http://sstatic.net/sf/favicon.ico'
  },
  su: {
    siteName: 'Super User',
    siteUrl: 'http://superuser.com',
    siteApi: 'http://api.superuser.com',
    siteIcon: 'http://sstatic.net/su/favicon.ico'
  },
  sa: {
    siteName: 'Stack Apps',
    siteUrl: 'http://stackapps.com',
    siteApi: 'http://api.stackapps.com',
    siteIcon: 'http://sstatic.net/sa/favicon.ico'
  }
};

function buildConfigurationFromUrl(url)
{
  var urlRegex = /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/;
  var paramRegex = /(?:^|&)([^&=]*)=?([^&]*)/g;

  var deconstructedUrl = urlRegex.exec(url);
  var params = {};
  deconstructedUrl[12].replace( paramRegex, function ( base, pkey, pvalue ) 
  {
    if(pkey) 
    {
      params[pkey] = pvalue;
    }
  });

  var configs = [];

  var sites = params['s'].split(',');
  var siteIds = params['i'].split(',');

  for(var i=0; i<sites.length; i++)
  {
    configs.push({
      siteName: baseSiteInfo[sites[i]].siteName,
      siteUrl: baseSiteInfo[sites[i]].siteUrl,
      siteApi: baseSiteInfo[sites[i]].siteApi,
      siteIcon: baseSiteInfo[sites[i]].siteIcon,
      userId: siteIds[i],
      viewType: 'favorites',
      displaySiteIcon: sites.length == 1
    }); 
  }

  var customCSSStr = 'html,body { width: 250px; height: 500px; color: #(fontcolor) } a { color: #(link); } .oddblock { background-color: #(odd); } .evenblock { background-color: #(even); } #usercontent { background-color: #(background); } #content { border: 3px solid #(background); } #actioncontent { background-color: #(background); } #sitetypes { background-color: #(background); } #contenttypes { background-color: #(background); } #subcontent { background-color: #(background); height: 330px; } .timelinedt { color: #(lowcolor); } .selected { background-color: #(selectcolor); } .goldbadge span,.silverbadge span,.bronzebadge span { background-color: #(background); } ';

  customCSSStr = customCSSStr.replace(/\(background\)/g, params['b'] == null ? 'eee' : params['b'])
                             .replace(/\(odd\)/g, params['o'] == null ? 'ccc' : params['o'])
                             .replace(/\(even\)/g, params['e'] == null ? 'aaa' : params['e'])
                             .replace(/\(link\)/g, params['l'] == null ? '542437' : params['l'])
                             .replace(/\(selectcolor\)/g, params['h'] == null ? 'ddd' : params['h'])
                             .replace(/\(lowcolor\)/g, params['h'] == null ? '53777A' : params['u'])
                             .replace(/\(fontcolor\)/g, params['f'] == null ? '000' : params['f']);

  createCSS(customCSSStr);

  return configs;
}

function createCSS(cssText)
{
  var cssElement = document.createElement("style");
  cssElement.type="text/css";
  if($.browser.msie)
  {
    cssElement.styleSheet.cssText = cssText;
    window.attachEvent("onload",function(){document.getElementsByTagName("head")[0].appendChild(cssElement); });
  }
  else
  {
    var docFrag = document.createDocumentFragment();
    docFrag.appendChild(document.createTextNode(cssText));
    cssElement.appendChild(docFrag);
    document.getElementsByTagName("head")[0].appendChild(cssElement);
  }
}

function fancyTime(ttf)
{
  var tdiff = ((new Date()).getTime()/1000) - ttf;

  if(tdiff < 10) return 'Now';
  else if(tdiff < 60) return Math.round(tdiff) + 'seconds ago';
  else if(tdiff > 60 && tdiff < 60*60) return Math.round(tdiff/60) + 'minutes ago';
  else if(tdiff > 60*60 && tdiff < 60*60*24) return Math.round(tdiff/60/60) + 'hours ago';
  else if(tdiff > 60*60*24 && tdiff < 60*60*24*7) return Math.round(tdiff/60/60/24) + ' days ago';
  else if(tdiff > 60*60*24*7 && tdiff < 60*60*24*30) return Math.round(tdiff/60/60/24/7) + ' weeks ago';
  else return Math.round(tdiff/60/60/24/30) + ' months ago';
}

MONTH_NAMES = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

function formatDate(aDate)
{
  return MONTH_NAMES[aDate.getMonth()] + ' ' + aDate.getDate() + ' ' + aDate.getFullYear();
}

function trimToFit(value, length)
{
  if(value.length > length) return value.substring(0, length) + '...';
  else return value;
}

function populateActionContent()
{
  var html = '<div id="actionitem">';
  html += 'Get your own <a target="_top" href="http://www.ioncannon.net/projects/woa/">Awesome Widget</a>.';
  html += '</div>';
  $('#actioncontent').html(html);
}

function processTimelineResponse(data, config)
{
  var count = 0;
  var html = '';
  if(data.user_timelines.length == 0)
  {
    html += 'No timeline.';
  }
  else
  {
    $.each(data.user_timelines, function()
    {
      var timelineItem = this;
      html += '<div class="timelineblock ' + (count % 2 == 0 ? 'evenblock' : 'oddblock') + '">';

      switch(timelineItem.timeline_type)
      {
        case 'comment':
          html += 'Commented on the ' + timelineItem.post_type + ' <a target="_top" href="' + config.siteUrl + '/questions/' + timelineItem.post_id + '">' + timelineItem.description + '</a>';
        break;
        case 'askoranswered':
          if( timelineItem.post_type == 'question')
            html += 'Asked <a target="_top" href="' + config.siteUrl + '/questions/' + timelineItem.post_id + '">' + timelineItem.description + '</a>';
          else
            html += 'Gave an answer to <a target="_top" href="' + config.siteUrl + '/questions/' + timelineItem.post_id + '">' + timelineItem.description + '</a>';
        break;
        case 'badge':
          html += 'Awarded the ' + timelineItem.description + ' badge for ' + timelineItem.detail;
        break;
        case 'revision':
          html += 'Revised <a target="_top" href="' + config.siteUrl + '/questions/' + timelineItem.post_id + '">' + timelineItem.description + '</a>';
        break;
        case 'accepted':
          html += 'Accepted an answer for <a target="_top" href="' + config.siteUrl + '/questions/' + timelineItem.post_id + '">' + timelineItem.description + '</a>';
        break;
      }
      html += '<div class="timelinedt">' + fancyTime(timelineItem.creation_date) + '</div>';
      html += '</div>';
      count++;
    });
  }
  $('#subcontent').html(html);
}

function processFavoriteOrQuestionResponse(data, config)
{
  var count = 0;
  var html = '';
  if(data.questions.length == 0)
  {
    html += 'None.';
  }
  else
  {
    $.each(data.questions, function()
    {
      var question = this;

      if(question.owner != null)
      {
        html += '<div class="questionblock ' + (count % 2 == 0 ? 'evenblock' : 'oddblock') + '">';

        html += '<div class="questionleft">';
        html += '<a target="_top" href="' + config.siteUrl + '/users/' + question.owner.user_id + '" title="' + question.owner.display_name + '"><img src="http://www.gravatar.com/avatar/' + question.owner.email_hash + '?s=32&d=identicon&r=PG"/></a>';
        html += '</div>';

        html += '<div class="questionright">';
        html += '<p><a target="_top" href="' + config.siteUrl + '/questions/' + question.question_id + '" title="' + question.title + '">' + trimToFit(question.title, 80) + '</a></p>';

        html += '<table class="detailtable">';
        html += '<tr><th>Votes</th><th>Answers</th><th>Created</th></tr><tr>';
        html += '<td>' + question.score + '</td>';
        html += '<td>' + question.answer_count + ' ' + (question.accepted_answer_id == null ? '' : '<img title="Answered" style="width: 8px; height: 8px;" src="accept.png"/>') + '</td>';
        html += '<td>' + fancyTime(question.creation_date) + '</td>';
        html += '</tr></table>';

        html += '</div>';
        html += '<br style="clear: both;"/>';
        html += '</div>';
        count++;
      }
    });
  }
  $('#subcontent').html(html);
}

function processUserResponse(data, config)
{
  var html = '';

  html += '<a target="_top" href="' + config.siteUrl + '/users/' + data.users[0].user_id + '" title="' + data.users[0].display_name + '"><img style="float: left" src="http://www.gravatar.com/avatar/' + data.users[0].email_hash + '?s=64&d=identicon&r=PG"/></a>';
  html += '<p>';
  if(config.displaySiteIcon)
  {
    html += '<a target="_top" href="' + config.siteUrl + '/" title="' + config.siteName + '"><img style="width: 16px; height: 16px;" src="' + config.siteIcon + '"/></a> ';
  }
  html += '<a target="_top" href="' + config.siteUrl + '/users/' + data.users[0].user_id + '" title="' + data.users[0].display_name + '" style="font-size: 12pt;">' + data.users[0].display_name + '</a><br/>';
 
  html += data.users[0].reputation + '<br/>';

  if(data.users[0].badge_counts.gold > 0)   html += '<span class="goldbadge"><span>' + data.users[0].badge_counts.gold + '</span></span> ';
  if(data.users[0].badge_counts.silver > 0) html += '<span class="silverbadge"><span>' + data.users[0].badge_counts.silver + '</span></span> ';
  if(data.users[0].badge_counts.bronze > 0) html += '<span class="bronzebadge"><span>' + data.users[0].badge_counts.bronze + '</span></span>';

  html += '<br/>Member since ' + formatDate(new Date(data.users[0].creation_date * 1000));

  html += '</p>';

  $('#usercontent').html(html);
}

function selectList(link, viewType, config)
{
  $('#subcontent').html('<img src="spinner.gif"/>');
  config.viewType = viewType;
  loadSite(config, false);

  $('#myfavlink').removeClass('selected').attr('style', '');
  $('#myqlink').removeClass('selected').attr('style', '');
  $('#mytllink').removeClass('selected').attr('style', '');

  $(link).addClass('selected').attr('style', 'border-top: 1px solid #000');

  return false;
}

function loadSite(config, loadAll)
{
  if(loadAll) populateActionContent();

  if(loadAll)
  {
    $.getJSON(config.siteApi + '/0.8/users/' + config.userId + '?jsonp=?', 
              { key: '7eDzZgpL8U69MLLAdxJoYA' }, 
              function(data) 
              {
                processUserResponse(data, config);
              });
  }

  $.getJSON(config.siteApi + '/0.8/users/' + config.userId + '/' + config.viewType + '?jsonp=?', 
            { key: '7eDzZgpL8U69MLLAdxJoYA' }, 
            function(data) 
            {
              switch(config.viewType)
              {
                case 'favorites':
                case 'questions':
                  processFavoriteOrQuestionResponse(data, config);
                break;
                case 'timeline':
                  processTimelineResponse(data, config);
                break;
              }
            });
}
