using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListActitivies
    {
        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public string Username  { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync( x => x.UserName == request.Username);

                if(user == null) return null;

                var query = _context.Activities
                        .Where(x => 
                            x.Attendees.Any(u => u.AppUser.UserName == request.Username))
                        .OrderBy(x => x.Date)
                        .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider,
                            new {currentUserName = request.Username})
                        .AsQueryable();
                
                query = request.Predicate switch
                {
                    "past" => query.Where(x => x.Date < DateTime.UtcNow),
                    "future" => query.Where(x => x.Date >= DateTime.UtcNow),
                    "isHosting" => query.Where(x => x.HostUsername == request.Username),
                    _ => query
                };

                // if(request.Predicate == "future")
                // {
                //     query = query.Where(x => x.Date > DateTime.UtcNow);
                // }
                // else if(request.Predicate == "past")
                // {
                //     query = query.Where(x => x.Date < DateTime.UtcNow);
                // }
                // else if (request.Predicate == "isHosting")
                // {
                //     query = query.Where(x => x.HostUsername == request.Username);
                // }
            
                var activities = await query.ToListAsync();

                return Result<List<UserActivityDto>>.Success(activities);
            }
        }
    }
}